import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Save,
} from "lucide-react";

interface ProconSalesOrder {
  id: string;
  no: number;
  date: string;
  soNo: string;
  contractNo: string;
  client: string;
  equipmentScopeLocation: string;
  equipmentReceived: string;
  scopeOfWork: string;
  manPower: string;
  location: string;
  mob: string; // Changed from periodByHour
  demob: string; // Changed from periodByReportTo
  duration: string;
  reportMob: string; // Changed from reported
  reportDemob: string; // Changed from dueDate
  reportDuration: string; // Changed from delaySubmitReport
  reportReceived: string;
  dueDateReport?: string; // New field for Due Date Report
  dueDateFinance: string;
  delaySubmitToFinance: string;
  dueDatePI?: string; // New: Due Date PI
  delaySubmitPI?: string; // New: Delay Submit PI
  submitToFinance?: string; // New: Submit to Finance
  piAmount: string;
  keterangan: string;
  piNo: string;
  poKontrakReceived: string;
  remarkProjectControl: string;
  invoiceNo: string;
  invoiceAmount: string;
  invoiceAmountPpn: string;
  dueDatePayment: string;
  paidDate: string;
  delayPayment: string;
  remarkFinance: string;
  status:
    | "Bar Review"
    | "Cancel"
    | "On Duty"
    | "Paid"
    | "Plan"
    | "Prepare BAP"
    | "Prepare PI"
    | "Report GBP"
    | "Report Review"
    | "Revisi Report"
    | "SO Cancel"
    | "SO Minus"
    | "Tambahan PI"
    | "Waiting Payment"
    | "Waiting Report"
    | "Waiting SP3";
  lirAmount: string; // Changed from lir to lirAmount for nominal uang
  paymentStatus: string; // New field for Paid/Unpaid status
  yearSheet: string;
  statusPekerjaan: string;
  statusAR: string;
  statusAP: string;
  remark: string;
  logDataPak: string;
  logMekanik: string;
  tunjanganGaji?: string; // New field for tunjangan+gaji
  prorateTeknisi?: string; // New field for prorate teknisi
}

const ProconSalesOrderDashboard: React.FC = () => {
  const DEMOB_WARNING_THRESHOLD_DAYS = 7; // Define "approaching" as within 7 days
  const [searchNoSO, setSearchNoSO] = useState("");
  const [searchNomorKontrak, setSearchNomorKontrak] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [selectedJenisPekerjaan, setSelectedJenisPekerjaan] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [jenisPekerjaanDropdownOpen, setJenisPekerjaanDropdownOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState<string>("");
  // CRUD Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProconSalesOrder | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<ProconSalesOrder>>({});

  // Sample data matching the Excel structure
  const [salesOrders, setSalesOrders] = useState<ProconSalesOrder[]>([
    // Red rows - Critical/Overdue status
    {
      id: "1",
      no: 1,
      date: "01-Jan-25",
      soNo: "SO-2025-001",
      contractNo: "KD-001",
      client: "PT PERTAMINA HULU ENERGI ONWJ",
      equipmentScopeLocation: "ONSHORE",
      equipmentReceived: "COMPLETE",
      scopeOfWork: "STAT",
      manPower: "Andi (NDT Lv.2), Budi (Helper)",
      location: "KARAWANG",
      mob: "01-Jan-25",
      demob: "01-Jan-25",
      duration: "1 DAY",
      reportMob: "01-Jan-25",
      reportDemob: "02-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "17-Jan-25",
      dueDateReport: "03-Jan-25",
      dueDateFinance: "03-Jan-25",
      delaySubmitToFinance: "14",
      dueDatePI: "03-Jan-25",
      delaySubmitPI: "14",
      submitToFinance: "14",
      piAmount: "15",
      keterangan: "OVERDUE",
      piNo: "PI-2025-001",
      poKontrakReceived: "28-Dec-24",
      remarkProjectControl:
        "Perlu koordinasi ulang dengan client terkait jadwal inspeksi",
      invoiceNo: "INV-2025-001",
      invoiceAmount: "15,000,000",
      invoiceAmountPpn: "16,650,000",
      dueDatePayment: "31-Jan-25",
      paidDate: "",
      delayPayment: "25",
      remarkFinance: "OVERDUE PAYMENT",
      status: "Waiting Payment", // Updated status
      lirAmount: "0",
      paymentStatus: "Pending",
      yearSheet: "2025",
      statusPekerjaan: "OVERDUE",
      statusAR: "OVERDUE",
      statusAP: "OVERDUE",
      remark: "CRITICAL - IMMEDIATE ACTION REQUIRED",
      logDataPak: "DELAYED",
      logMekanik: "DELAYED",
      tunjanganGaji: "5,000,000", // Sample data
      prorateTeknisi: "1,000,000", // Sample data
    },
    {
      id: "2",
      no: 2,
      date: "05-Jan-25",
      soNo: "SO-2025-002",
      contractNo: "KD-002",
      client: "MEDCO E&P ONSHORE NORTH JAVA",
      equipmentScopeLocation: "ONSHORE",
      equipmentReceived: "PARTIAL",
      scopeOfWork: "NDT INSPECTION",
      manPower: "Eka (Supervisor), Fajar (NDT Lv.3), Gani (Welder)",
      location: "TUBAN",
      mob: "05-Jan-25",
      demob: "07-Jan-25",
      duration: "2 DAYS",
      reportMob: "07-Jan-25",
      reportDemob: "08-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "20-Jan-25",
      dueDateReport: "09-Jan-25",
      dueDateFinance: "09-Jan-25",
      delaySubmitToFinance: "11",
      dueDatePI: "09-Jan-25",
      delaySubmitPI: "11",
      submitToFinance: "11",
      piAmount: "22",
      keterangan: "CRITICAL",
      piNo: "PI-2025-002",
      poKontrakReceived: "02-Jan-25",
      remarkProjectControl: "Menunggu kelengkapan peralatan NDT dari supplier",
      invoiceNo: "",
      invoiceAmount: "",
      invoiceAmountPpn: "",
      dueDatePayment: "",
      paidDate: "",
      delayPayment: "0",
      remarkFinance: "NOT INVOICED",
      status: "Prepare PI", // Updated status
      lirAmount: "0",
      paymentStatus: "Unpaid",
      yearSheet: "2025",
      statusPekerjaan: "CRITICAL",
      statusAR: "NOT STARTED",
      statusAP: "NOT STARTED",
      remark: "URGENT - EQUIPMENT REQUIRED",
      logDataPak: "PENDING",
      logMekanik: "PENDING",
      tunjanganGaji: "0", // Sample data
      prorateTeknisi: "0", // Sample data
    },
    // White/Light rows - Normal/Completed status
    {
      id: "3",
      no: 3,
      date: "10-Jan-25",
      soNo: "SO-2025-003",
      contractNo: "KD-003",
      client: "MEDCO E&P ONSHORE NORTH JAVA",
      equipmentScopeLocation: "OFFSHORE",
      equipmentReceived: "COMPLETE",
      scopeOfWork: "ULTRASONIC INSPECTION",
      manPower: "Kiki (Lead Inspector), Lutfi (NDT Lv.3), Maman (NDT Lv.2)",
      location: "OFFSHORE PLATFORM",
      mob: "10-Jan-25",
      demob: "13-Jan-25",
      duration: "3 DAYS",
      reportMob: "13-Jan-25",
      reportDemob: "14-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "14-Jan-25",
      dueDateReport: "15-Jan-25",
      dueDateFinance: "15-Jan-25",
      delaySubmitToFinance: "0",
      dueDatePI: "15-Jan-25",
      delaySubmitPI: "0",
      submitToFinance: "0",
      piAmount: "45",
      keterangan: "COMPLETED",
      piNo: "PI-2025-003",
      poKontrakReceived: "08-Jan-25",
      remarkProjectControl: "Progres sesuai timeline, dokumentasi lengkap",
      invoiceNo: "INV-2025-003",
      invoiceAmount: "45,000,000",
      invoiceAmountPpn: "49,950,000",
      dueDatePayment: "28-Feb-25",
      paidDate: "25-Feb-25",
      delayPayment: "0",
      remarkFinance: "PAID ON TIME",
      status: "Paid", // Updated status
      lirAmount: "22.000.000",
      paymentStatus: "Paid",
      yearSheet: "2025",
      statusPekerjaan: "SELESAI",
      statusAR: "LUNAS",
      statusAP: "PAID",
      remark: "EXCELLENT PERFORMANCE",
      logDataPak: "COMPLETE",
      logMekanik: "COMPLETE",
      tunjanganGaji: "10,000,000", // Sample data
      prorateTeknisi: "2,000,000", // Sample data
    },
    {
      id: "4",
      no: 4,
      date: "12-Jan-25",
      soNo: "SO-2025-004",
      contractNo: "KD-004",
      client: "PT PERTAMINA HULU ENERGI ONWJ",
      equipmentScopeLocation: "ONSHORE",
      equipmentReceived: "COMPLETE",
      scopeOfWork: "RADIOGRAPHIC INSPECTION",
      manPower: "Sandi (NDT Lv.2), Toni (Helper)",
      location: "GRESIK",
      mob: "12-Jan-25",
      demob: "14-Jan-25",
      duration: "1.5 DAYS",
      reportMob: "14-Jan-25",
      reportDemob: "15-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "15-Jan-25",
      dueDateReport: "16-Jan-25",
      dueDateFinance: "16-Jan-25",
      delaySubmitToFinance: "0",
      dueDatePI: "16-Jan-25",
      delaySubmitPI: "0",
      submitToFinance: "0",
      piAmount: "18",
      keterangan: "COMPLETED",
      piNo: "PI-2025-004",
      poKontrakReceived: "10-Jan-25",
      remarkProjectControl: "Tim bekerja dengan baik, hasil inspeksi memuaskan",
      invoiceNo: "INV-2025-004",
      invoiceAmount: "18,000,000",
      invoiceAmountPpn: "19,980,000",
      dueDatePayment: "28-Feb-25",
      paidDate: "20-Feb-25",
      delayPayment: "0",
      remarkFinance: "PAID",
      status: "Paid", // Updated status
      lirAmount: "22.000.000",
      paymentStatus: "Paid",
      yearSheet: "2025",
      statusPekerjaan: "SELESAI",
      statusAR: "LUNAS",
      statusAP: "PAID",
      remark: "GOOD QUALITY WORK",
      logDataPak: "COMPLETE",
      logMekanik: "COMPLETE",
      tunjanganGaji: "7,500,000", // Sample data
      prorateTeknisi: "1,500,000", // Sample data
    },
    // Pink/Salmon rows - Warning/Attention status
    {
      id: "5",
      no: 5,
      date: "15-Jan-25",
      soNo: "SO-2025-005",
      contractNo: "KD-005",
      client: "ENI MUARA BAKAU B.V.",
      equipmentScopeLocation: "OFFSHORE",
      equipmentReceived: "COMPLETE",
      scopeOfWork: "STAT",
      manPower: "Wawan (Supervisor), Xavi (NDT Lv.3), Yayan (Welder)",
      location: "MUARA BAKAU",
      mob: "15-Jan-25",
      demob: "21-Jan-25",
      duration: "6 DAYS",
      reportMob: "21-Jan-25",
      reportDemob: "22-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "25-Jan-25",
      dueDateReport: "23-Jan-25",
      dueDateFinance: "23-Jan-25",
      delaySubmitToFinance: "2",
      dueDatePI: "23-Jan-25",
      delaySubmitPI: "2",
      submitToFinance: "2",
      piAmount: "75",
      keterangan: "MINOR DELAY",
      piNo: "PI-2025-005",
      poKontrakReceived: "13-Jan-25",
      remarkProjectControl:
        "Terdapat kendala cuaca offshore, estimasi delay 2 hari",
      invoiceNo: "INV-2025-005",
      invoiceAmount: "75,000,000",
      invoiceAmountPpn: "83,250,000",
      dueDatePayment: "31-Mar-25",
      paidDate: "",
      delayPayment: "5",
      remarkFinance: "PAYMENT PENDING",
      status: "Report Review", // Updated status
      lirAmount: "0", // Changed from "PARTIAL" to "0"
      paymentStatus: "Pending", // Added missing field
      yearSheet: "2025",
      statusPekerjaan: "WARNING", // Added missing field
      statusAR: "OUTSTANDING",
      statusAP: "PENDING",
      remark: "MINOR DELAYS - MONITORING REQUIRED",
      logDataPak: "PARTIAL",
      logMekanik: "PARTIAL",
      tunjanganGaji: "6,000,000", // Sample data
      prorateTeknisi: "1,200,000", // Sample data
    },
    // Blue rows - In Progress status
    {
      id: "6",
      no: 6,
      date: "18-Jan-25",
      soNo: "SO-2025-006",
      contractNo: "KD-006",
      client: "MEDCO E&P ONSHORE NORTH JAVA",
      equipmentScopeLocation: "ONSHORE",
      equipmentReceived: "COMPLETE",
      scopeOfWork: "MAGNETIC PARTICLE INSPECTION",
      manPower: "Candra (Lead), Dedi (NDT Lv.2), Eko (Helper)",
      location: "SURABAYA",
      mob: "18-Jan-25",
      demob: "21-Jan-25",
      duration: "2.5 DAYS",
      reportMob: "21-Jan-25",
      reportDemob: "22-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "23-Jan-25",
      dueDateReport: "23-Jan-25",
      dueDateFinance: "23-Jan-25",
      delaySubmitToFinance: "0",
      dueDatePI: "23-Jan-25",
      delaySubmitPI: "0",
      submitToFinance: "0",
      piAmount: "12",
      keterangan: "IN PROGRESS",
      piNo: "PI-2025-006",
      poKontrakReceived: "16-Jan-25",
      remarkProjectControl: "Pekerjaan berjalan lancar, koordinasi tim baik",
      invoiceNo: "",
      invoiceAmount: "",
      invoiceAmountPpn: "",
      dueDatePayment: "",
      paidDate: "",
      delayPayment: "0",
      remarkFinance: "AWAITING COMPLETION",
      status: "On Duty", // Updated status
      lirAmount: "0",
      paymentStatus: "Pending",
      yearSheet: "2025",
      statusPekerjaan: "PROGRESS",
      statusAR: "NOT STARTED",
      statusAP: "NOT STARTED",
      remark: "WORK IN PROGRESS - ON SCHEDULE",
      logDataPak: "PROGRESS",
      logMekanik: "PROGRESS",
      tunjanganGaji: "4,000,000", // Sample data
      prorateTeknisi: "800,000", // Sample data
    },
    // Green rows - Good/Excellent status
    {
      id: "7",
      no: 7,
      date: "20-Jan-25",
      soNo: "SO-2025-007",
      contractNo: "KD-007",
      client: "PT PERTAMINA HULU ENERGI ONWJ",
      equipmentScopeLocation: "OFFSHORE",
      equipmentReceived: "COMPLETE",
      scopeOfWork: "COMPREHENSIVE INSPECTION",
      manPower: "Hendra (PM), Ilham (Supervisor), Jajang (Lead Inspector)",
      location: "OFFSHORE RIG",
      mob: "20-Jan-25",
      demob: "29-Jan-25",
      duration: "9 DAYS",
      reportMob: "29-Jan-25",
      reportDemob: "30-Jan-25",
      reportDuration: "1 DAY",
      reportReceived: "28-Jan-25",
      dueDateReport: "31-Jan-25",
      dueDateFinance: "31-Jan-25",
      delaySubmitToFinance: "-3",
      dueDatePI: "31-Jan-25",
      delaySubmitPI: "-3",
      submitToFinance: "-3",
      piAmount: "95",
      keterangan: "EXCELLENT",
      piNo: "PI-2025-007",
      poKontrakReceived: "18-Jan-25",
      remarkProjectControl:
        "Pekerjaan selesai lebih cepat dari jadwal, kualitas excellent",
      invoiceNo: "INV-2025-007",
      invoiceAmount: "95,000,000",
      invoiceAmountPpn: "105,450,000",
      dueDatePayment: "31-Mar-25",
      paidDate: "25-Mar-25",
      delayPayment: "-6",
      remarkFinance: "EARLY PAYMENT",
      status: "Paid", // Updated status
      lirAmount: "0", // Added missing field
      paymentStatus: "Paid", // Added missing field
      yearSheet: "2025", // Added missing field
      statusPekerjaan: "SELESAI", // Added missing field
      statusAR: "LUNAS", // Added missing field
      statusAP: "PAID", // Added missing field
      remark: "EXCELLENT PERFORMANCE", // Added missing field
      logDataPak: "EXCELLENT",
      logMekanik: "EXCELLENT",
      tunjanganGaji: "12,000,000", // Sample data
      prorateTeknisi: "2,400,000", // Sample data
    },
  ]);

  useEffect(() => {
    const criticalMessages: string[] = [];
    const warningMessages: string[] = [];

    salesOrders.forEach((item) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const demobDate = parseDemobDate(item.demob);

      if (demobDate) {
        const diffTime = demobDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          criticalMessages.push(
            `Demob for SO ${item.soNo} is overdue or today!`
          );
        } else if (diffDays <= DEMOB_WARNING_THRESHOLD_DAYS) {
          warningMessages.push(
            `Demob for SO ${item.soNo} is approaching in ${diffDays} days!`
          );
        }
      }
    });

    if (criticalMessages.length > 0) {
      toast.error(
        <div>
          {criticalMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      );
    } else if (warningMessages.length > 0) {
      toast.warn(
        <div>
          {warningMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      );
    }
  }, [salesOrders, DEMOB_WARNING_THRESHOLD_DAYS]);

  const jenisPekerjaanOptions = ["On Call", "Tender"];

  // Filtered data
  const filteredData = salesOrders.filter((item) => {
    const matchesNoSO = item.soNo
      .toLowerCase()
      .includes(searchNoSO.toLowerCase());
    const matchesNomorKontrak = item.poKontrakReceived
      .toLowerCase()
      .includes(searchNomorKontrak.toLowerCase());
    const matchesClient = item.client
      .toLowerCase()
      .includes(searchClient.toLowerCase());
    const matchesJenisPekerjaan = selectedJenisPekerjaan
      ? item.statusPekerjaan === selectedJenisPekerjaan
      : true;

    // Date filtering
    const itemDate = new Date(item.date.split("-").reverse().join("-"));
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate =
      (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

    return (
      matchesNoSO &&
      matchesNomorKontrak &&
      matchesClient &&
      matchesJenisPekerjaan &&
      matchesDate
    );
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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const demobDate = parseDemobDate(item.demob);

    if (demobDate) {
      const diffTime = demobDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Red rows: demob is today or in the past, or within the warning threshold
      if (diffDays <= DEMOB_WARNING_THRESHOLD_DAYS) {
        return "bg-red-100";
      }
    }

    // Red rows - Critical/Overdue status
    if (
      item.status === "Waiting Payment" ||
      item.status === "Prepare PI" ||
      item.status === "SO Minus" ||
      item.status === "SO Cancel" ||
      item.keterangan === "OVERDUE" ||
      item.keterangan === "CRITICAL"
    ) {
      return "bg-red-100";
    }
    // Pink/Salmon rows - Warning/Attention status
    if (
      item.status === "Report Review" ||
      item.status === "Revisi Report" ||
      item.keterangan === "MINOR DELAY"
    ) {
      return "bg-pink-100";
    }
    // Blue rows - In Progress status
    if (
      item.status === "On Duty" ||
      item.status === "Plan" ||
      item.status === "Prepare BAP" ||
      item.status === "Waiting Report" ||
      item.status === "Waiting SP3" ||
      item.keterangan === "IN PROGRESS"
    ) {
      return "bg-blue-100";
    }
    // Green rows - Excellent/Good status
    if (item.status === "Paid" || item.keterangan === "EXCELLENT") {
      return "bg-green-100";
    }
    // White/Light rows - Normal/Completed status (default)
    return "bg-white";
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "On Duty":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Waiting Payment":
        return "bg-red-100 text-red-800 border-red-200";
      case "Prepare PI":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Report Review":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Plan":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Bar Review":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Cancel":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Prepare BAP":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Report GBP":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Revisi Report":
        return "bg-lime-100 text-lime-800 border-lime-200";
      case "SO Cancel":
        return "bg-red-200 text-red-800 border-red-300";
      case "SO Minus":
        return "bg-red-300 text-red-800 border-red-400";
      case "Tambahan PI":
        return "bg-orange-200 text-orange-800 border-orange-300";
      case "Waiting Report":
        return "bg-blue-200 text-blue-800 border-blue-300";
      case "Waiting SP3":
        return "bg-cyan-200 text-cyan-800 border-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper to compute due date from document date (dd-MMM-yy) + days
  const computeReportDueDate = (
    demobDate: string,
    projectType: string
  ): string => {
    try {
      if (!demobDate) return "";
      const parts = demobDate.split("-");
      if (parts.length !== 3) return "";
      const day = parseInt(parts[0], 10);
      const month = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth(); // Parse month abbreviation
      const year = 2000 + parseInt(parts[2], 10); // Assume 20xx
      const d = new Date(year, month, day);
      if (isNaN(d.getTime())) return "";

      let daysToAdd = 0;
      if (projectType === "On Call") {
        daysToAdd = 2; // H+2 for On Call
      } else if (projectType === "Tender") {
        daysToAdd = 14; // H+14 for Tender
      }
      d.setDate(d.getDate() + daysToAdd);

      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      };
      return d.toLocaleDateString("en-GB", options);
    } catch {
      return "";
    }
  };

  // Helper to parse demob date string (dd-MMM-yy) into a Date object
  const parseDemobDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split("-");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames.indexOf(parts[1]);
    const year = 2000 + parseInt(parts[2], 10); // Assume 20xx
    return new Date(year, month, day);
  };

  // CRUD Functions
  const handleAdd = () => {
    const nextNo = salesOrders.length + 1;
    setFormData({
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
      contractNo: `KD-${String(nextNo).padStart(3, "0")}`,
      yearSheet: "2025",
      status: "Plan", // Updated default status
      keterangan: "IN PROGRESS",
      statusPekerjaan: "PROGRESS",
      statusAR: "NOT STARTED",
      statusAP: "NOT STARTED",
      lirAmount: "0",
      paymentStatus: "Unpaid",
      reportMob: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
      reportDemob: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
      reportDuration: "0",
      equipmentReceived: "PARTIAL",
      equipmentScopeLocation: "ONSHORE",
      delaySubmitToFinance: "0",
      delayPayment: "0",
      logDataPak: "PENDING",
      logMekanik: "PENDING",
      poKontrakReceived: new Date().toISOString().split("T")[0],
      dueDateReport: computeReportDueDate(
        formData.demob || "",
        formData.statusPekerjaan || ""
      ),
      dueDatePI: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
      delaySubmitPI: "0",
      submitToFinance: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
      tunjanganGaji: "0", // Initialize new field
      prorateTeknisi: "0", // Initialize new field
    });
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
      const newSoNo = `SO-2025-${String(newNo).padStart(3, "0")}`;
      const newContractNo = `KD-${String(newNo).padStart(3, "0")}`;

      const newItem: ProconSalesOrder = {
        ...(formData as ProconSalesOrder),
        id: newId,
        no: newNo,
        soNo: newSoNo,
        contractNo: formData.contractNo || newContractNo,
        piNo: `PI-2025-${String(newNo).padStart(3, "0")}`,
        dueDateReport: computeReportDueDate(
          formData.demob || "",
          formData.statusPekerjaan || ""
        ),
      };

      setSalesOrders((prev) => [newItem, ...prev]);
      setIsAddModalOpen(false);
    } else if (isEditModalOpen && selectedItem) {
      setSalesOrders((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...(formData as ProconSalesOrder),
                id: selectedItem.id,
                no: selectedItem.no,
                dueDatePI: formData.dueDatePI,
                delaySubmitPI: formData.delaySubmitPI,
                submitToFinance: formData.submitToFinance,
              }
            : item
        )
      );
      setIsEditModalOpen(false);
    }
    setFormData({});
    setSelectedItem(null);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setSalesOrders((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleInputChange = (field: keyof ProconSalesOrder, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING SALES ORDER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Procon
                </span>
                <span className="mx-2">â€º</span>
                <span className="text-blue-600 font-semibold">Sales Order</span>
              </nav>
            </div>
            <div className="flex items-center justify-end gap-3 text-sm">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
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
              <label className="block text-xs font-medium text-gray-700">
                Cari No SO
              </label>
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
              <label className="block text-xs font-medium text-gray-700">
                Cari Nomor Kontrak
              </label>
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
              <label className="block text-xs font-medium text-gray-700">
                Pilih Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span
                    className={
                      selectedJenisPekerjaan ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {selectedJenisPekerjaan || "Pilih jenis pekerjaan..."}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      jenisPekerjaanDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedJenisPekerjaan("");
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
                        <span
                          className={`w-3 h-3 rounded-full ${
                            jenis === "On Call" ? "bg-cyan-500" : "bg-red-500"
                          }`}
                        ></span>
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Client */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Client
              </label>
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
              <label className="block text-xs font-medium text-gray-700">
                Periode Dari
              </label>
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
              <label className="block text-xs font-medium text-gray-700">
                Periode Sampai
              </label>
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
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Sales Order</span>
            </button>
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
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[50px]"
                    rowSpan={2}
                  >
                    NO
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]"
                    rowSpan={2}
                  >
                    DATE
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    SO NO
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[200px]"
                    rowSpan={2}
                  >
                    CLIENT
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    QUO/PO/WO/RO/SPK/CONTRACT NO
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    PO/Kontrak Received
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[150px]"
                    rowSpan={2}
                  >
                    SCOPE OF WORK
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]"
                    rowSpan={2}
                  >
                    MAN POWER
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    LOCATION
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300"
                    colSpan={3}
                  >
                    PERIOD BY EMAIL
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300"
                    colSpan={3}
                  >
                    PERIOD BY REPORT & TS
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    REPORT RECEIVED
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    DUE DATE REPORT
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    DUE DATE PI
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    SUBMIT TO FINANCE
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    DELAY SUBMIT TO FINANCE
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    DELAY SUBMIT PI
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    DUE DATE FINANCE
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    PI AMOUNT
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    PI NO
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    KETERANGAN
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[150px]"
                    rowSpan={2}
                  >
                    REMARK PROJECT CONTROL
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    INVOICE NO
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    INVOICE AMOUNT
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    INVOICE AMOUNT PPN 11%
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    DUE DATE PAYMENT
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]"
                    rowSpan={2}
                  >
                    PAID DATE
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    DELAY PAYMENT
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    REMARK FINANCE
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    L/R
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    STATUS
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    TUNJANGAN+GAJI
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]"
                    rowSpan={2}
                  >
                    PRORATE TEKNISI
                  </th>
                  <th
                    className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]"
                    rowSpan={2}
                  >
                    ACTIONS
                  </th>
                </tr>
                {/* Second row - Sub headers */}
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">
                    MOB
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">
                    DEMOB
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">
                    DURATION
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[50px]">
                    MOB
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[60px]">
                    DEMOB
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">
                    DURATION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className={`${getRowColor(
                      item
                    )} transition-all duration-300 ease-in-out`}
                  >
                    <td className="px-2 py-3 border border-gray-300 text-center">
                      <span className="font-bold text-gray-900 text-xs">
                        {item.no}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-2 py-3 font-bold text-blue-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.soNo}
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300 font-medium">
                      {item.client}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
                      >
                        {item.contractNo}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        {item.poKontrakReceived}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300 font-medium">
                      {item.scopeOfWork}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-bold">
                      {item.manPower}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-300">
                      {item.location}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.mob}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.demob}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-medium">
                      {item.duration}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.reportMob}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.reportDemob}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-medium">
                      {item.reportDuration}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.reportReceived}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.dueDateReport}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.dueDatePI}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.submitToFinance}
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span
                        className={`font-bold ${
                          parseInt(item.delaySubmitToFinance || "0") > 0
                            ? "text-red-600 bg-red-100 px-2 py-1 rounded-full"
                            : parseInt(item.delaySubmitToFinance || "0") < 0
                            ? "text-green-600 bg-green-100 px-2 py-1 rounded-full"
                            : "text-gray-600"
                        }`}
                      >
                        {item.delaySubmitToFinance}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span
                        className={`font-bold ${
                          parseInt(item.delaySubmitPI || "0") > 0
                            ? "text-red-600 bg-red-100 px-2 py-1 rounded-full"
                            : parseInt(item.delaySubmitPI || "0") < 0
                            ? "text-green-600 bg-green-100 px-2 py-1 rounded-full"
                            : "text-gray-600"
                        }`}
                      >
                        {item.delaySubmitPI}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.dueDateFinance}
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.piAmount && `Rp ${item.piAmount},000,000`}
                    </td>
                    <td className="px-2 py-3 text-blue-600 text-xs border border-gray-300 font-medium text-center">
                      {item.piNo}
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          item.keterangan
                        )}`}
                      >
                        {item.keterangan}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300">
                      {item.remarkProjectControl}
                    </td>
                    <td className="px-2 py-3 text-blue-600 text-xs border border-gray-300 font-medium text-center">
                      {item.invoiceNo}
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.invoiceAmount && `Rp ${item.invoiceAmount}`}
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.invoiceAmountPpn && `Rp ${item.invoiceAmountPpn}`}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.dueDatePayment}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">
                      {item.paidDate}
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span
                        className={`font-bold ${
                          parseInt(item.delayPayment) > 0
                            ? "text-red-600 bg-red-100 px-2 py-1 rounded-full"
                            : parseInt(item.delayPayment) < 0
                            ? "text-green-600 bg-green-100 px-2 py-1 rounded-full"
                            : "text-gray-600"
                        }`}
                      >
                        {item.delayPayment}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300">
                      {item.remarkFinance}
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.lirAmount && `Rp ${item.lirAmount}`}
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span
                        className={`font-bold px-2 py-1 rounded-full ${
                          item.paymentStatus === "Paid"
                            ? "text-green-600 bg-green-100"
                            : item.paymentStatus === "Pending"
                            ? "text-yellow-600 bg-yellow-100"
                            : "text-red-600 bg-red-100"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.tunjanganGaji && `Rp ${item.tunjanganGaji}`}
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.prorateTeknisi && `Rp ${item.prorateTeknisi}`}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleView(item)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs"
                          title="View"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2 py-1 bg-green-600 text-white rounded-md text-xs"
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="px-2 py-1 bg-red-600 text-white rounded-md text-xs"
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
                  Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <label className="flex items-center gap-2">
                  <span className="text-gray-600">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow shadow-blue-600/20"
                          : "text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleGoToPage();
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleGoToPage}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs disabled:opacity-50"
                  disabled={totalPages === 0}
                >
                  Go
                </button>
                <span className="text-gray-500">
                  / {Math.max(1, totalPages)}
                </span>
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
              <h2 className="text-xl font-bold text-gray-900">
                Add New Sales Order
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client || ""}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Scope Location
                </label>
                <select
                  value={formData.equipmentScopeLocation || ""}
                  onChange={(e) =>
                    handleInputChange("equipmentScopeLocation", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="ONSHORE">ONSHORE</option>
                  <option value="OFFSHORE">OFFSHORE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Received
                </label>
                <select
                  value={formData.equipmentReceived || ""}
                  onChange={(e) =>
                    handleInputChange("equipmentReceived", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope of Work
                </label>
                <textarea
                  value={formData.scopeOfWork || ""}
                  onChange={(e) =>
                    handleInputChange("scopeOfWork", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Man Power
                </label>
                <input
                  type="text"
                  value={formData.manPower || ""}
                  onChange={(e) =>
                    handleInputChange("manPower", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO/Kontrak Received
                </label>
                <input
                  type="date"
                  value={formData.poKontrakReceived || ""}
                  onChange={(e) =>
                    handleInputChange("poKontrakReceived", e.target.value)
                  }
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
              <h2 className="text-xl font-bold text-gray-900">
                Edit Sales Order
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client || ""}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Scope Location
                </label>
                <select
                  value={formData.equipmentScopeLocation || ""}
                  onChange={(e) =>
                    handleInputChange("equipmentScopeLocation", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="ONSHORE">ONSHORE</option>
                  <option value="OFFSHORE">OFFSHORE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Received
                </label>
                <select
                  value={formData.equipmentReceived || ""}
                  onChange={(e) =>
                    handleInputChange("equipmentReceived", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope of Work
                </label>
                <textarea
                  value={formData.scopeOfWork || ""}
                  onChange={(e) =>
                    handleInputChange("scopeOfWork", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Man Power
                </label>
                <input
                  type="text"
                  value={formData.manPower || ""}
                  onChange={(e) =>
                    handleInputChange("manPower", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO/Kontrak Received
                </label>
                <input
                  type="date"
                  value={formData.poKontrakReceived || ""}
                  onChange={(e) =>
                    handleInputChange("poKontrakReceived", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Bar Review">Bar Review</option>
                  <option value="Cancel">Cancel</option>
                  <option value="On Duty">On Duty</option>
                  <option value="Paid">Paid</option>
                  <option value="Plan">Plan</option>
                  <option value="Prepare BAP">Prepare BAP</option>
                  <option value="Prepare PI">Prepare PI</option>
                  <option value="Report GBP">Report GBP</option>
                  <option value="Report Review">Report Review</option>
                  <option value="Revisi Report">Revisi Report</option>
                  <option value="SO Cancel">SO Cancel</option>
                  <option value="SO Minus">SO Minus</option>
                  <option value="Tambahan PI">Tambahan PI</option>
                  <option value="Waiting Payment">Waiting Payment</option>
                  <option value="Waiting Report">Waiting Report</option>
                  <option value="Waiting SP3">Waiting SP3</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks Project Control
                </label>
                <textarea
                  value={formData.remarkProjectControl || ""}
                  onChange={(e) =>
                    handleInputChange("remarkProjectControl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter project control remarks..."
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
              <h2 className="text-xl font-bold text-gray-900">
                View Sales Order
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SO Number
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.soNo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.date}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.client}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Scope Location
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.equipmentScopeLocation}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Received
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.equipmentReceived}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Man Power
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.manPower}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope of Work
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.scopeOfWork}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.location}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.status}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PI Amount
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedItem.piAmount}
                </p>
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
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Delete
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete Sales Order{" "}
              <strong>{selectedItem.soNo}</strong>? This action cannot be
              undone.
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
      <ToastContainer />
    </div>
  );
};

export default ProconSalesOrderDashboard;
