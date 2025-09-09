import React from "react";
import { useAuth } from "../context/AuthContext";
import SuspectDashboard from "./SuspectDashboard";
import ProspectDashboard from "./ProspectDashboard";
import PenawaranOnCallDashboard from "./PenawaranOnCallDashboard";
import PenawaranTenderDashboard from "./PenawaranTenderDashboard";
import KontrakDealDashboard from "./KontrakDealDashboard";
import HPPIndukDashboard from "./HPPIndukDashboard";
import SalesOrderDashboard from "./SalesOrderDashboard";
import KontrakDashboard from "./KontrakDashboard";
import OperationalSalesOrderDashboard from "./OperationalSalesOrderDashboard";
import SOTurunanDashboard from "./SOTurunanDashboard";
import ManPowerDashboard from "./ManPowerDashboard";
import ManPowerPlanDashboard from "./ManPowerPlanDashboard";
import HPPTurunanDashboard from "./HPPTurunanDashboard";
import ProduksiDashboard from "./ProduksiDashboard";
import ProsesProduksiDashboard from "./ProsesProduksiDashboard";
import TimesheetDashboard from "./TimesheetDashboard";
import TimesheetPegawaiDashboard from "./TimesheetPegawaiDashboard";
import TimesheetBarangDashboard from "./TimesheetBarangDashboard";
import TrainingDashboard from "./TrainingDashboard";
import ProsesPengajuanTrainingDashboard from "./ProsesPengajuanTrainingDashboard";
import PBGDashboard from "./PBGDashboard";
import HRDDashboard from "./HRDDashboard";
import ReqrutmenDashboard from "./ReqrutmenDashboard";
import ListLamaranDashboard from "./ListLamaranDashboard";
import KontrakKerjaDashboard from "./KontrakKerjaDashboard";
import HistoryLamaranDashboard from "./HistoryLamaranDashboard";
import ReqManPowerDashboard from "./ReqManPowerDashboard";
import TunjanganUnitDashboard from "./TunjanganUnitDashboard";
import TunjanganDashboard from "./TunjanganDashboard";
import ResignDashboard from "./ResignDashboard";
import HRDMarketingDashboard from "./HRDMarketingDashboard";
import LemburDashboard from "./LemburDashboard";
import DaftarPegawaiDashboard from "./DaftarPegawaiDashboard";
import KontrakPegawaiDashboard from "./KontrakPegawaiDashboard";
import MonitoringKontrakPegawaiDashboard from "./MonitoringKontrakPegawaiDashboard";
import MasterUMRDashboard from "./MasterUMRDashboard";
import DaftarGajiDashboard from "./DaftarGajiDashboard";
import PotonganGajiDashboard from "./PotonganGajiDashboard";
import HistoryPeminjamanDashboard from "./HistoryPeminjamanDashboard";
import DaftarPeminjamKaryawanDashboard from "./DaftarPeminjamKaryawanDashboard";
import AbsensiTeknisiDashboard from "./AbsensiTeknisiDashboard";
import ApprovalTimesheetDashboard from "./ApprovalTimesheetDashboard";
import DaftarPenilaianDashboard from "./DaftarPenilaianDashboard";
import PengadaanDashboard from "./PengadaanDashboard";
import VendorListDashboard from "./VendorListDashboard";
import MasterVendorDashboard from "./MasterVendorDashboard";
import SeleksiSupplierDashboard from "./SeleksiSupplierDashboard";
import POBarangDashboard from "./POBarangDashboard";
import POJasaDashboard from "./POJasaDashboard";
import ProsesSeleksiSupplierDashboard from "./ProsesSeleksiSupplierDashboard";
import PODashboard from "./PODashboard";
import DaftarPenerimaanBarangDashboard from "./DaftarPenerimaanBarangDashboard";
import PurchasingDashboard from "./PurchasingDashboard";
import InvoiceDashboard from "./InvoiceDashboard";
import GudangDashboard from "./GudangDashboard";
import DaftarSeleksiSupplierBiddingDashboard from "./DaftarSeleksiSupplierBiddingDashboard";
import ApprovalTiketDashboard from "./ApprovalTiketDashboard";
import ApprovalInvoiceDashboard from "./ApprovalInvoiceDashboard";
import ApprovalPenggajianDashboard from "./ApprovalPenggajianDashboard";
import ApprovalPOTrainingDashboard from "./ApprovalPOTrainingDashboard";
import ApprovalVoucherDashboard from "./ApprovalVoucherDashboard";
import DaftarPembayaranDashboard from "./DaftarPembayaranDashboard";
import DaftarVoucherDashboard from "./DaftarVoucherDashboard";
import LaporanHutangUsahaDashboard from "./LaporanHutangUsahaDashboard";
import MonitoringEndorseCertificateHRD from "./MonitoringEndorseCertificateHRD";
// Finance Dashboards
import FinanceMainDashboard from "./FinanceDashboard";
import APDashboard from "./APDashboard";
import LaporanAPDashboard from "./LaporanAPDashboard";
import FinanceLaporanPembayaranHutangDashboard from "./FinanceLaporanPembayaranHutangDashboard";
import ReimburseVoucherDashboard from "./ReimburseVoucherDashboard";
import ARDashboard from "./ARDashboard";
import ProsesPembayaranARDashboard from "./ProsesPembayaranARDashboard";
import LaporanARDashboard from "./LaporanARDashboard";
import FinancePembayaranGajiPage from "./FinancePembayaranGajiPage";
import ReportKontrakDashboard from "./ReportKontrakDashboard";
import InsentifMarketingDashboard from "./InsentifMarketingDashboard";
import FinanceBuktiKasMasukDashboard from "./FinanceBuktiKasMasukDashboard";
import FinanceBuktiKasKeluarDashboard from "./FinanceBuktiKasKeluarDashboard";
import FinanceLaporanKasKecilDashboard from "./FinanceLaporanKasKecilDashboard";
import FinanceLaporanOutstandingCADashboard from "./FinanceLaporanOutstandingCADashboard";
import FinanceBuktiBankMasukDashboard from "./FinanceBuktiBankMasukDashboard";
import FinanceBuktiBankKeluarDashboard from "./FinanceBuktiBankKeluarDashboard";
import FinanceLaporanBankHarianDashboard from "./FinanceLaporanBankHarianDashboard";
import FinanceLaporanBankHarianKhususDashboard from "./FinanceLaporanBankHarianKhususDashboard";
import FinancePermintaanPencairanDanaDashboard from "./FinancePermintaanPencairanDanaDashboard";
import CollectionDashboardSO from "./CollectionDashboardSO";
import CollectionDashboardProformaInvoice from "./CollectionDashboardProformaInvoice";
import CollectionDashboardInvoice from "./CollectionDashboardInvoice";
import CollectionDashboardInvoiceOutstanding from "./CollectionDashboardInvoiceOutstanding";
import CollectionDatabaseCustomer from "./CollectionDatabaseCustomer";
import CollectionDashboardCashIn from "./CollectionDashboardCashIn";
import FinanceTandaTerimaDokumeniDashboard from "./FinanceTandaTerimaDokumeniDashboard";

// Gudang Dashboards
import MasterBarangDashboard from "./MasterBarangDashboard";
import KategoriBarangDashboard from "./KategoriBarangDashboard";
import SatuanBarangDashboard from "./SatuanBarangDashboard";
import ExpiredBarangDashboard from "./ExpiredBarangDashboard";
import RestockExpiredBarangDashboard from "./RestockExpiredBarangDashboard";
import StockBarangDashboard from "./StockBarangDashboard";
import GudangProyekDashboard from "./GudangProyekDashboard";
import PenerimaanBarangMasukDashboard from "./PenerimaanBarangMasukDashboard";
import MutasiBarangDashboard from "./MutasiBarangDashboard";
import PengembalianBarangDashboard from "./PengembalianBarangDashboard";
import BarangKarantinaDashboard from "./BarangKarantinaDashboard";
import BarangDibuangDashboard from "./BarangDibuangDashboard";
import TimesheetBarangGudangDashboard from "./TimesheetBarangGudangDashboard";
import StockOpnameDashboard from "./StockOpnameDashboard";
import VerifikasiStockOpnameDashboard from "./VerifikasiStockOpnameDashboard";
import LaporanSemuaStockDashboard from "./LaporanSemuaStockDashboard";
import MonitoringAlatProyekDashboard from "./MonitoringAlatProyekDashboard";
import PermintaanBarangGudangDashboard from "./PermintaanBarangGudangDashboard";
import GudangMainDashboard from "./GudangMainDashboard";
import DashboardKPIDashboard from "./DashboardKPIDashboard"; // New import for KPI Dashboard
import GeneralMasterKPIDashboard from "./GeneralMasterKPIDashboard"; // Import the new Master KPI component
import GeneralListKPIDashboard from "./GeneralListKPIDashboard"; // Import the new List KPI component
import GeneralVoucherDashboard from "./GeneralVoucherDashboard"; // Corrected: Import the actual GeneralVoucherDashboard
import GeneralProsesVoucherDashboard from "./GeneralProsesVoucherDashboard"; // Import the new Proses Voucher component
import GeneralReimburseDashboard from "./GeneralReimburseDashboard"; // Import the new GeneralReimburseDashboard
import GeneralProsesReimburseDashboard from "./GeneralProsesReimburseDashboard"; // Import the new Proses Reimburse component
import GeneralCashAdvanceDashboard from "./GeneralCashAdvanceDashboard"; // Import the new GeneralCashAdvanceDashboard
import GeneralProsesCashAdvance from "./GeneralProsesCashAdvance"; // Import the new Proses Cash Advance component
import GeneralPurchasingRequestDashboard from "./GeneralPurchasingRequestDashboard"; // Import the new GeneralPurchasingRequestDashboard
import GeneralProsesPurchasingRequest from "./GeneralProsesPurchasingRequest"; // Import the new Proses Purchasing Request component
import PengajianActiveDashboard from "./PengajianActiveDashboard"; // Import the new PengajianActiveDashboard
import GeneralPertanggungJawabanVoucherDashboard from "./GeneralPertanggungJawabanVoucherDashboard"; // Import the new PengajianActiveDashboard
import GeneralPengajuanCutiDashboard from "./GeneralPengajuanCutiDashboard"; // NEW: Pengajuan Cuti
import GeneralApproveCutiDashboard from "./GeneralApproveCutiDashboard"; // NEW: Approve Cuti
import PegawaiListCutiDashboard from "./PegawaiListCutiDashboard"; // NEW: HRD Pegawai List Cuti

// QHSE Dashboards
import QHSENewDashboard from "./QHSENewDashboard";
import PerizinanAlatDashboard from "./PerizinanAlatDashboard";
import MonitoringMCUDashboard from "./MonitoringMCUDashboard";
import MonitoringTrainingDashboard from "./MonitoringTrainingDashboard";
import AuditDashboard from "./AuditDashboard";
import MonitoringISOTOPDashboard from "./MonitoringISOTOPDashboard";
import MonitoringPTIDashboard from "./MonitoringPTIDashboard";
import MonitoringAlatSafetyDashboard from "./MonitoringAlatSafetyDashboard";
import JadwalRealisasiProgramDashboard from "./JadwalRealisasiProgramDashboard";
import LegalitasPerusahaanDashboard from "./LegalitasPerusahaanDashboard";
import QHSEPerformanceDashboard from "./QHSEPerformanceDashboard";
import RadiographyMonitoringKameraDashboard from "./RadiographyMonitoringKameraDashboard";
import RadiographySIBPersonnelRadiasiDashboard from "./RadiographySIBPersonnelRadiasiDashboard";
import RadiographyDosimeterSakuDashboard from "./RadiographyDosimeterSakuDashboard";
import RadiographySurveymeterDashboard from "./RadiographySurveymeterDashboard";
import RadiographyTLDBadgeDashboard from "./RadiographyTLDBadgeDashboard";
import RadiographyUjiUsapKameraDashboard from "./RadiographyUjiUsapKameraDashboard";
import RadiographyKontrakSIBDashboard from "./RadiographyKontrakSIBDashboard";
import MonitoringDaftarAlatUkurDashboard from "./MonitoringDaftarAlatUkurDashboard";
import MonitoringPersonnelDashboard from "./MonitoringPersonnelDashboard";
import TrainingMatrixDashboard from "./TrainingMatrixDashboard";
import MedicalCheckUpDashboard from "./MedicalCheckUpDashboard";
import APDDashboard from "./APDDashboard";
import NomorReportDashboard from "./NomorReportDashboard";
import MonitoringPRDashboard from "./MonitoringPRDashboard";
import MonitoringCADashboard from "./MonitoringCADashboard";
import MonitoringVoucherDashboard from "./MonitoringVoucherDashboard";
import MonitoringEndorseCertificateDashboard from "./MonitoringEndorseCertificateDashboard";
import MonitoringReimburseDashboard from "./MonitoringReimburseDashboard";
import MonitoringManifestBarangDashboard from "./MonitoringManifestBarangDashboard";
import MonitoringPBGDashboard from "./MonitoringPBGDashboard";
import MonitoringRFIDashboard from "./MonitoringRFIDashboard";
import QHSEMasterKPIDashboard from "./QHSEMasterKPIDashboard";
import QHSEListKPIDashboard from "./QHSEListKPIDashboard";
import ProconApprovalPBGDashboard from "./ProconApprovalPBGDashboard";

// Accounting Dashboards
import AccountingMainDashboard from "./AccountingMainDashboard";
import MasterCOADashboard from "./MasterCOADashboard";
import KasMasukDashboard from "./KasMasukDashboard";
import KasKeluarDashboard from "./KasKeluarDashboard";
import BankMasukDashboard from "./BankMasukDashboard";
import BankKeluarDashboard from "./BankKeluarDashboard";
import PostingJurnalDashboard from "./PostingJurnalDashboard";
import LaporanJurnalDashboard from "./LaporanJurnalDashboard";
import TutupBukuDashboard from "./TutupBukuDashboard";
import LabaRugiDashboard from "./LabaRugiDashboard";
import NeracaDashboard from "./NeracaDashboard";

// Tax Dashboards
import TaxMainDashboard from "./TaxMainDashboard";
import PajakMasukanDashboard from "./PajakMasukanDashboard";
import PajakKeluaranDashboard from "./PajakKeluaranDashboard";
import PPh21Dashboard from "./PPh21Dashboard";

// Procon Dashboards
import ProconMainDashboard from "./ProconMainDashboard";
import ProconInvoiceDashboard from "./ProconInvoiceDashboard";
import ProconOverviewDashboard from "./ProconOverviewDashboard";
import ProconKontrakExpenditureDashboard from "./ProconKontrakExpenditureDashboard";
import ProconSalesOrderDashboard from "./ProconSalesOrderDashboard";
import ProconPembuatanPIDashboard from "./ProconPembuatanPIDashboard";
import ProconHPPIndukDashboard from "./ProconHPPIndukDashboard";
import LaporanLabaRugi from "./LaporanLabaRugi";
import LaporanPerSO from "./LaporanPerSO";
import ProconLRPDashboard from "./ProconLRPDashboard";
import ProconLRPTunjanganTimesheetTeknisi from "./ProconLRPTunjanganTimesheetTeknisi";
import ProconLRPGaji from "./ProconLRPGaji";
import ProconLRPTimesheetBarang from "./ProconLRPTimesheetBarang";
import ProconLRPKasKeluar from "./ProconLRPKasKeluar";
import ProconLRPBankKeluar from "./ProconLRPBankKeluar";
import ProconApprovalPurchaseRequest from "./ProconApprovalPurchaseRequest";
import ProconPODashboard from "./ProconPODashboard";
import ProconPOProses from "./ProconPOProses";
import ProconPOApproval from "./ProconPOApproval";
// NEW: Procon Approval Dashboards
import ApprovalPoJasa from "../pages/procon/approval/ApprovalPoJasa";
import ApprovalTimesheet from "../pages/procon/approval/ApprovalTimesheet";

// GA Template
import GATemplate from "./GATemplate";
import GAKendaraanMasterDashboard from "./GAKendaraanMasterDashboard";
import GAPajakKendaraanDashboard from "./GAPajakKendaraanDashboard";
import GALegalitasPerusahaanDashboard from "./GALegalitasPerusahaanDashboard";
import GAPerformanceDashboard from "./GAPerformanceDashboard";
import GASaranaPrasaranaDashboard from "./GASaranaPrasaranaDashboard";
import GAServiceKendaraanDashboard from "./GAServiceKendaraanDashboard";
import GAMaintenanceSaprasDashboard from "./GAMaintenanceSaprasDashboard";
import GAUtilityDashboard from "./GAUtilityDashboard";
import GAATKStockDashboard from "./GAATKStockDashboard";
import GAATKRequestDashboard from "./GAATKRequestDashboard";
import GABackupDataUserDashboard from "./GABackupDataUserDashboard";
import GAITTroubleShootDashboard from "./GAITTroubleShootDashboard";
import GAITMaintenanceDeviceDashboard from "./GAITMaintenanceDeviceDashboard";
import GAITMonitoringServerDashboard from "./GAITMonitoringServerDashboard";

// NEW: Import your new blank page components
import MasterKPIHRDDashboard from "./MasterKPIHRDDashboard";
import MasterIndikatorHRDDashboard from "./MasterIndikatorHRDDashboard";
import EvaluasiVendorDashboard from "./EvaluasiVendorDashboard"; // NEW: Import EvaluasiVendorDashboard
import GudangPenerimaanDashboard from "./GudangPenerimaanDashboard"; // NEW: Import GudangPenerimaanDashboard
import OperationalMainDashboard from "./OperationalMainDashboard"; // NEW: Import OperationalMainDashboard
import MarketingMainDashboard from "./MarketingMainDashboard"; // NEW: Import MarketingMainDashboard
import ManagementMainDashboard from "./ManagementMainDashboard"; // NEW: Import ManagementMainDashboard
import MonitoringIzinAlatDashboard from "./MonitoringIzinAlatDashboard"; // NEW: Import MonitoringIzinAlatDashboard
import GASuportOperasionalDashboard from "./GASuportOperasionalDashboard";
import MonitoringPerizinanDashboard from "./MonitoringPerizinanDashboard"; // NEW: Import MonitoringPerizinanDashboard
import ApproveSPKDashboard from "./ApproveSPKDashboard"; // NEW: Import ApproveSPKDashboard
import GAIBPMaintenanceSaprasDashboard from "./GAIBPMaintenanceSaprasDashboard";
import GAIBPTroubleshootSaranaKerjaDashboard from "./GAIBPTroubleshootSaranaKerjaDashboard";
import GAIBPPersediaanATKDashboard from "./GAIBPPersediaanATKDashboard";
import GAIBPKebersihanLingkunganDashboard from "./GAIBPKebersihanLingkunganDashboard";
import GeneralUtilityDashboard from "./GeneralUtilityDashboard";

import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  Award,
  Clock,
  Menu,
  Phone,
  Megaphone,
  FileText,
  ArrowRight,
  ArrowLeft,
  File,
  CheckCircle,
} from "lucide-react";

interface DashboardProps {
  currentPage: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentPage }) => {
  const { user } = useAuth();

  // Main dashboard content based on user role
  const renderMainDashboard = () => {
    if (user?.role === "hrd") {
      return <HRDDashboard />;
    }

    if (user?.role === "pengadaan") {
      return <PengadaanDashboard />;
    }

    if (user?.role === "finance") {
      return <FinanceMainDashboard />; // Render FinanceMainDashboard for finance role
    }

    if (user?.role === "gudang") {
      return <GudangMainDashboard />; // Render GudangMainDashboard for gudang role
    }

    if (user?.role === "management") {
      return <ManagementMainDashboard />; // Render ManagementMainDashboard for management role
    }

    if (user?.role === "qhse") {
      return <QHSENewDashboard />; // Render QHSENewDashboard for qhse role
    }

    if (user?.role === "accounting") {
      return <AccountingMainDashboard />; // Render AccountingMainDashboard for accounting role
    }

    if (user?.role === "tax") {
      return <TaxMainDashboard />; // Render TaxMainDashboard for tax role
    }

    if (user?.role === "procon") {
      return <ProconMainDashboard />; // Render ProconMainDashboard for procon role
    }

    // Marketing Dashboard
    if (user?.role === "marketing") {
      return <MarketingMainDashboard />; // Render MarketingMainDashboard for marketing role
    }

    // Operational Dashboard
    return <OperationalMainDashboard />;
  };

  // Route to specific pages based on currentPage
  const renderPageContent = () => {
    console.log("Dashboard: Current page received:", currentPage);
    // Gudang Routes
    if (currentPage === "/gudang/dashboard") {
      return <GudangMainDashboard />;
    }
    if (currentPage === "/gudang/barang/master") {
      return <MasterBarangDashboard />;
    }
    if (currentPage === "/gudang/barang/kategori") {
      return <KategoriBarangDashboard />;
    }
    if (currentPage === "/gudang/barang/satuan") {
      return <SatuanBarangDashboard />;
    }
    if (currentPage === "/gudang/barang/expired") {
      return <ExpiredBarangDashboard />;
    }
    if (currentPage === "/gudang/barang/restock-expired") {
      return <RestockExpiredBarangDashboard />;
    }
    if (currentPage === "/gudang/barang/stock") {
      return <StockBarangDashboard />;
    }
    if (currentPage === "/gudang/gudang-proyek/dashboard") {
      return <GudangProyekDashboard />;
    }
    if (currentPage === "/gudang/penerimaan-barang-masuk/dashboard") {
      return <PenerimaanBarangMasukDashboard />;
    }
    if (currentPage === "/gudang/mutasi-barang/dashboard") {
      return <MutasiBarangDashboard />;
    }
    if (currentPage === "/gudang/pengembalian-barang/pengembalian") {
      return <PengembalianBarangDashboard />;
    }
    if (currentPage === "/gudang/pengembalian-barang/karantina") {
      return <BarangKarantinaDashboard />;
    }
    if (currentPage === "/gudang/pengembalian-barang/dibuang") {
      return <BarangDibuangDashboard />;
    }
    if (currentPage === "/gudang/pengembalian-barang/timesheet") {
      return <TimesheetBarangGudangDashboard />;
    }
    if (currentPage === "/gudang/stock-opname/stock-opname") {
      return <StockOpnameDashboard />;
    }
    if (currentPage === "/gudang/stock-opname/verifikasi") {
      return <VerifikasiStockOpnameDashboard />;
    }
    if (currentPage === "/gudang/stock-opname/laporan") {
      return <LaporanSemuaStockDashboard />;
    }
    if (currentPage === "/gudang/monitoring-alat-proyek/dashboard") {
      return <MonitoringAlatProyekDashboard />;
    }
    if (currentPage === "/gudang/permintaan-barang-gudang/dashboard") {
      return <PermintaanBarangGudangDashboard />;
    }
    // NEW Gudang 'Izin Alat' Routes
    if (currentPage === "/gudang/monitoring-izin-alat") {
      return <MonitoringIzinAlatDashboard />;
    }
    if (currentPage === "/gudang/perizinan-alat") {
      return <PerizinanAlatDashboard />;
    }
    if (currentPage === "/gudang/monitoring-perizinan") {
      return <MonitoringPerizinanDashboard />;
    }
    // NEW General Gudang Routes
    if (currentPage === "/gudang/general/kpi/dashboard") {
      console.log(
        "Dashboard: Rendering DashboardKPIDashboard for path:",
        currentPage
      );
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/gudang/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/gudang/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/gudang/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/gudang/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/gudang/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/gudang/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/gudang/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/gudang/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/gudang/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/gudang/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/gudang/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    // NEW Gudang General Cuti Routes
    if (currentPage === "/gudang/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/gudang/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }

    if (currentPage === "/ga/general/kpi/dashboard") {
      console.log(
        "Dashboard: Rendering DashboardKPIDashboard for path:",
        currentPage
      );
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/ga/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/ga/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/ga/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/ga/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/ga/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/ga/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/ga/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/ga/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/ga/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/ga/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/ga/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    // NEW ga General Cuti Routes
    if (currentPage === "/ga/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/ga/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }
    if (currentPage === "/ga/general/utility/dashboard") {
      return <GeneralUtilityDashboard />;
    }

    // Pengadaan Routes
    if (currentPage === "/pengadaan/dashboard") {
      return <PengadaanDashboard />;
    }
    if (currentPage === "/pengadaan/po/dashboard") {
      return <PODashboard />;
    }
    if (currentPage === "/pengadaan/seleksi/daftar") {
      return <SeleksiSupplierDashboard />;
    }
    if (currentPage === "/pengadaan/vendor/list") {
      return <VendorListDashboard />;
    }
    if (currentPage === "/pengadaan/vendor/master") {
      return <MasterVendorDashboard />;
    }
    if (currentPage === "/pengadaan/vendor/evaluasi") {
      // NEW: Route for Evaluasi Vendor
      return <EvaluasiVendorDashboard />;
    }
    if (currentPage === "/pengadaan/seleksi/seleksi") {
      return <DaftarSeleksiSupplierBiddingDashboard />;
    }
    if (currentPage === "/pengadaan/po/barang") {
      return <POBarangDashboard />;
    }
    if (currentPage === "/pengadaan/po/jasa") {
      return <POJasaDashboard />;
    }
    if (currentPage === "/pengadaan/penerimaan/daftar") {
      return <DaftarPenerimaanBarangDashboard />;
    }
    if (currentPage === "/pengadaan/penerimaan/purchasing") {
      return <PurchasingDashboard />;
    }
    if (currentPage === "/pengadaan/penerimaan/gudang") {
      // NEW: Route for Gudang Penerimaan
      return <GudangPenerimaanDashboard />;
    }
    if (currentPage === "/pengadaan/penerimaan/invoice") {
      return <InvoiceDashboard />;
    }
    if (currentPage === "/pengadaan/penerimaan/gudang") {
      return <GudangDashboard />;
    }
    // Pengadaan General Routes
    if (currentPage === "/pengadaan/general/kpi/dashboard") {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/pengadaan/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/pengadaan/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/pengadaan/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/pengadaan/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/pengadaan/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/pengadaan/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/pengadaan/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/pengadaan/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/pengadaan/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/pengadaan/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/pengadaan/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    // NEW Pengadaan General Cuti Routes
    if (currentPage === "/pengadaan/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/pengadaan/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }

    // HRD Routes
    if (currentPage === "/hrd/dashboard") {
      return <HRDDashboard />;
    }
    if (currentPage === "/hrd/tunjangan-unit/dashboard") {
      return <TunjanganUnitDashboard />;
    }
    if (currentPage === "/hrd/tunjangan/dashboard") {
      return <TunjanganDashboard />;
    }
    if (currentPage === "/hrd/resign/dashboard") {
      return <ResignDashboard />;
    }
    if (currentPage === "/hrd/rekrutmen/dashboard") {
      return <ReqrutmenDashboard />;
    }
    if (currentPage === "/hrd/rekrutmen/list-lamaran") {
      return <ListLamaranDashboard />;
    }
    if (currentPage === "/hrd/rekrutmen/kontrak-kerja") {
      return <KontrakKerjaDashboard />;
    }
    if (currentPage === "/hrd/rekrutmen/history-lamaran") {
      return <HistoryLamaranDashboard />;
    }
    if (currentPage === "/hrd/rekrutmen/req-man-power") {
      return <ReqManPowerDashboard />;
    }
    if (currentPage === "/hrd/marketing/dashboard") {
      return <HRDMarketingDashboard />;
    }
    if (currentPage === "/hrd/lembur/dashboard") {
      return <LemburDashboard />;
    }
    if (currentPage === "/hrd/pegawai/daftar") {
      return <DaftarPegawaiDashboard />;
    }
    if (currentPage === "/hrd/pegawai/kontrak-pegawai") {
      return <KontrakPegawaiDashboard />;
    }
    if (currentPage === "/hrd/pegawai/monitoring-kontrak") {
      return <MonitoringKontrakPegawaiDashboard />;
    }
    if (currentPage === "/hrd/pegawai/master-umr") {
      return <MasterUMRDashboard />;
    }
    if (currentPage === "/hrd/pegawai/pr-training") {
      // NEW: Route for PR Training
      return <ProsesPengajuanTrainingDashboard role="hrd" />; // Pass role prop
    }
    if (currentPage === "/hrd/pegawai/list-cuti") {
      return <PegawaiListCutiDashboard />;
    }
    if (currentPage === "/hrd/gaji/daftar") {
      return <DaftarGajiDashboard />;
    }
    if (currentPage === "/hrd/gaji/pengajian") {
      return <PengajianActiveDashboard />;
    }
    if (currentPage === "/hrd/gaji/potongan") {
      return <PotonganGajiDashboard />;
    }
    if (currentPage === "/hrd/gaji/history-peminjaman") {
      return <HistoryPeminjamanDashboard />;
    }
    if (currentPage === "/hrd/gaji/daftar-peminjam-karyawan") {
      return <DaftarPeminjamKaryawanDashboard />;
    }
    if (currentPage === "/hrd/absensi/teknisi") {
      return <AbsensiTeknisiDashboard />;
    }
    if (currentPage === "/hrd/absensi/approval-timesheet") {
      return <ApprovalTimesheetDashboard />;
    }
    if (currentPage === "/hrd/penilaian/daftar") {
      return <DaftarPenilaianDashboard />;
    }
    // NEW: Route for Master KPI HRD
    if (currentPage === "/hrd/penilaian/master-kpi-hrd") {
      return <MasterKPIHRDDashboard />;
    }
    // NEW: Route for Master Indikator HRD
    if (currentPage === "/hrd/penilaian/master-indikator-hrd") {
      return <MasterIndikatorHRDDashboard />;
    }
    // NEW: Route for Approve SPK
    if (currentPage === "/hrd/spk/approve") {
      return <ApproveSPKDashboard />;
    }
    if (currentPage === "/hrd/monitoring/endorse-certificate") {
      return <MonitoringEndorseCertificateHRD role="hrd" />;
    }
    // HRD General Routes
    if (currentPage === "/hrd/general/kpi/dashboard") {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/hrd/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/hrd/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/hrd/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/hrd/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/hrd/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/hrd/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/hrd/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/hrd/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/hrd/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/hrd/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/hrd/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    // NEW HRD General Cuti Routes
    if (currentPage === "/hrd/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/hrd/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }

    // Marketing Routes
    if (currentPage === "/marketing/dashboard") {
      // NEW: Route for Marketing Main Dashboard
      return <MarketingMainDashboard />;
    }
    if (currentPage === "/marketing/suspect/dashboard") {
      return <SuspectDashboard />;
    }
    if (currentPage === "/marketing/prospect/dashboard") {
      return <ProspectDashboard />;
    }
    if (currentPage === "/marketing/penawaran/on-call") {
      return <PenawaranOnCallDashboard />;
    }
    if (currentPage === "/marketing/penawaran/tender") {
      return <PenawaranTenderDashboard />;
    }
    if (currentPage === "/marketing/kontrak-deal/dashboard") {
      return <KontrakDealDashboard />;
    }
    if (currentPage === "/marketing/hpp-induk/dashboard") {
      return <HPPIndukDashboard />;
    }
    if (currentPage === "/marketing/sales-order/dashboard") {
      return <SalesOrderDashboard />;
    }
    if (currentPage === "/marketing/insentif-marketing/dashboard") {
      return <InsentifMarketingDashboard />;
    }
    // Procon Routes
    if (currentPage === "/procon/sales-order/dashboard") {
      return <ProconSalesOrderDashboard />;
    }
    if (currentPage === "/procon/kontrak-expenditure") {
      return <ProconKontrakExpenditureDashboard />;
    }
    if (currentPage === "/procon/proforma-invoice/dashboard") {
      return <ProconInvoiceDashboard />;
    }
    if (currentPage === "/procon/proforma-invoice/pembuatan") {
      return <ProconPembuatanPIDashboard />;
    }
    if (currentPage === "/procon/hpp-induk/dashboard") {
      return <ProconHPPIndukDashboard />;
    }
    // Procon Laba Rugi Project (LRP)
    if (currentPage === "/procon/lrp/dashboard") {
      return <ProconLRPDashboard />;
    }
    if (currentPage === "/procon/lrp/tunjangan-timesheet-teknisi") {
      return <ProconLRPTunjanganTimesheetTeknisi />;
    }
    if (currentPage === "/procon/lrp/gaji") {
      return <ProconLRPGaji />;
    }
    if (currentPage === "/procon/lrp/timesheet-barang") {
      return <ProconLRPTimesheetBarang />;
    }
    if (currentPage === "/procon/lrp/kas-keluar") {
      return <ProconLRPKasKeluar />;
    }
    if (currentPage === "/procon/lrp/bank-keluar") {
      return <ProconLRPBankKeluar />;
    }
    // Procon Purchase Request
    if (currentPage === "/procon/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/procon/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    if (currentPage === "/procon/purchase-request/approval") {
      return <ProconApprovalPurchaseRequest />;
    }
    // Procon Purchase Order
    if (currentPage === "/procon/purchase-order/dashboard") {
      return <ProconPODashboard />;
    }
    if (currentPage === "/procon/purchase-order/proses") {
      return <ProconPOProses />;
    }
    if (currentPage === "/procon/purchase-order/approval") {
      return <ProconPOApproval />;
    }
    // Procon General Routes (mirror General components)
    if (currentPage === "/procon/general/kpi/dashboard") {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/procon/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/procon/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/procon/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/procon/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/procon/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/procon/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/procon/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/procon/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/procon/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/procon/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/procon/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    if (currentPage === "/procon/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/procon/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }
    // Procon General > PBG
    if (currentPage === "/procon/general/pbg/mutasi-barang") {
      return <MutasiBarangDashboard />;
    }
    if (currentPage === "/procon/general/pbg/timesheet-barang") {
      return <TimesheetBarangGudangDashboard />;
    }
    if (currentPage === "/procon/general/pbg/permintaan-barang-gudang") {
      return <PermintaanBarangGudangDashboard />;
    }
    if (currentPage === "/procon/general/pbg/approval") {
      return <ProconApprovalPBGDashboard />;
    }
    if (currentPage === "/marketing/report-kontrak") {
      return <ReportKontrakDashboard />;
    }
    // Marketing General Routes
    if (currentPage === "/marketing/general/kpi/dashboard") {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/marketing/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/marketing/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/marketing/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/marketing/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/marketing/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/marketing/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/marketing/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/marketing/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/marketing/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/marketing/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/marketing/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    // NEW Marketing General Cuti Routes
    if (currentPage === "/marketing/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/marketing/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }

    // GA Routes
    if (currentPage === "/ga/dashboard") {
      return <GATemplate title="GA Main Dashboard" />;
    }
    // Monitoring Pajak Kendaraan
    if (currentPage === "/ga/pajak-kendaraan/master-kendaraan") {
      return <GAKendaraanMasterDashboard />;
    }
    if (currentPage === "/ga/pajak-kendaraan/pajak-kendaraan") {
      return <GAPajakKendaraanDashboard />;
    }
    if (currentPage === "/ga/legalitas/monitoring") {
      return <GALegalitasPerusahaanDashboard />;
    }
    if (currentPage === "/ga/performance") {
      return <GAPerformanceDashboard />;
    }
    if (currentPage === "/ga/monitoring/sapras") {
      return <GASaranaPrasaranaDashboard />;
    }
    if (currentPage === "/ga/monitoring/service-kendaraan") {
      return <GAServiceKendaraanDashboard />;
    }
    if (currentPage === "/ga/monitoring/maintenance-sapras") {
      return <GAMaintenanceSaprasDashboard />;
    }
    if (currentPage === "/ga/monitoring/utility") {
      return <GAUtilityDashboard />;
    }
    if (currentPage === "/ga/atk/monitoring-stok") {
      return <GAATKStockDashboard />;
    }
    if (currentPage === "/ga/atk/pengajuan") {
      return <GAATKRequestDashboard />;
    }
    if (currentPage === "/ga/it/backup") {
      return <GABackupDataUserDashboard />;
    }
    if (currentPage === "/ga/it/troubleshoot") {
      return <GAITTroubleShootDashboard />;
    }
    if (currentPage === "/ga/it/maintenance-device") {
      return <GAITMaintenanceDeviceDashboard />;
    }
    if (currentPage === "/ga/it/monitoring-server") {
      return <GAITMonitoringServerDashboard />;
    }
    // KPI Department
    if (currentPage === "/ga/kpi/master") {
      return <GATemplate title="KPI Master" subtitle="KPI Department" />;
    }
    if (currentPage === "/ga/kpi/list") {
      return <GATemplate title="List KPI" subtitle="KPI Department" />;
    }
    // Internal Business Process
    if (currentPage === "/ga/ibp/legalitas-perusahaan") {
      return (
        <GATemplate
          title="Legalitas Perusahaan"
          subtitle="Internal Business Process"
        />
      );
    }
    if (currentPage === "/ga/ibp/suport-operasional") {
      return <GASuportOperasionalDashboard />;
    }
    if (currentPage === "/ga/ibp/maintenance-sapras") {
      return <GAIBPMaintenanceSaprasDashboard />;
    }
    if (currentPage === "/ga/ibp/troubleshoot-sarana-kerja") {
      return <GAIBPTroubleshootSaranaKerjaDashboard />;
    }
    if (currentPage === "/ga/ibp/persediaan-atk") {
      return <GAIBPPersediaanATKDashboard />;
    }
    if (currentPage === "/ga/ibp/kebersihan-lingkungan") {
      return <GAIBPKebersihanLingkunganDashboard />;
    }
    if (currentPage === "/ga/ibp/utility") {
      return (
        <GATemplate title="Utility" subtitle="Internal Business Process" />
      );
    }
    // Legalitas Perusahaan (Monitoring & LKPM)
    if (currentPage === "/ga/legalitas/monitoring") {
      return <GATemplate title="Monitoring Legal Perusahaan & LKPM" />;
    }
    // GA Performance
    if (currentPage === "/ga/performance") {
      return <GATemplate title="GA Performance" />;
    }
    // Monitoring Sarana & Prasarana
    if (currentPage === "/ga/monitoring/sapras") {
      return <GATemplate title="Monitoring Sarana & Prasarana" />;
    }
    // Monitoring
    if (currentPage === "/ga/monitoring/pr") {
      return <GATemplate title="Monitoring Purchase Request (PR)" />;
    }
    if (currentPage === "/ga/monitoring/ca") {
      return <GATemplate title="Monitoring Cash Advance (CA)" />;
    }
    if (currentPage === "/ga/monitoring/voucher") {
      return <GATemplate title="Monitoring Voucher" />;
    }
    if (currentPage === "/ga/monitoring/pajak-kendaraan") {
      return <GATemplate title="Monitoring Pajak Kendaraan" />;
    }
    if (currentPage === "/ga/monitoring/service-kendaraan") {
      return <GATemplate title="Monitoring Service Kendaraan" />;
    }
    if (currentPage === "/ga/monitoring/maintenance-sapras") {
      return <GATemplate title="Monitoring Maintenance Sarana & Prasarana" />;
    }
    if (currentPage === "/ga/monitoring/utility") {
      return <GATemplate title="Monitoring Utility" />;
    }
    // Monitoring ATK
    if (currentPage === "/ga/atk/monitoring-stok") {
      return <GATemplate title="Monitoring Stok ATK" />;
    }
    if (currentPage === "/ga/atk/pengajuan") {
      return <GATemplate title="Pengajuan ATK dari User" />;
    }
    // Monitoring IT
    if (currentPage === "/ga/it/backup") {
      return (
        <GATemplate title="Backup Data Setiap User" subtitle="Monitoring IT" />
      );
    }
    if (currentPage === "/ga/it/troubleshoot") {
      return <GATemplate title="Trouble Shoot" subtitle="Monitoring IT" />;
    }
    if (currentPage === "/ga/it/maintenance-device") {
      return (
        <GATemplate
          title="Maintenance Perangkat Device"
          subtitle="Monitoring IT"
        />
      );
    }
    if (currentPage === "/ga/it/monitoring-server") {
      return <GATemplate title="Monitoring Server" subtitle="Monitoring IT" />;
    }

    // Operational Routes
    if (currentPage === "/operational/dashboard") {
      // NEW: Route for Operational Main Dashboard
      return <OperationalMainDashboard />;
    }
    if (currentPage === "/operational/kontrak/dashboard") {
      return <KontrakDashboard />;
    }
    if (currentPage === "/operational/sales-order/so") {
      return <OperationalSalesOrderDashboard />;
    }
    if (currentPage === "/operational/sales-order/so-turunan") {
      return <SOTurunanDashboard />;
    }
    if (currentPage === "/operational2/sales-order/so-turunan") {
      return <SOTurunanDashboard role="operational2" />;
    }
    if (currentPage === "/operational3/sales-order/so-turunan") {
      return <SOTurunanDashboard role="operational3" />;
    }
    if (currentPage === "/operational/man-power/man-power") {
      return <ManPowerDashboard />;
    }
    if (currentPage === "/operational/man-power/plan") {
      return <ManPowerPlanDashboard />;
    }
    if (currentPage === "/operational/hpp-turunan/dashboard") {
      return <HPPTurunanDashboard />;
    }
    if (currentPage === "/operational/produksi/dashboard") {
      return <ProduksiDashboard />;
    }
    if (currentPage === "/operational/produksi/proses") {
      return <ProsesProduksiDashboard />;
    }
    if (currentPage === "/operational/timesheet/dashboard") {
      return <TimesheetDashboard />;
    }
    if (currentPage === "/operational/timesheet/pegawai") {
      return <TimesheetPegawaiDashboard />;
    }
    if (currentPage === "/operational/timesheet/barang") {
      return <TimesheetBarangDashboard />;
    }
    if (currentPage === "/operational/training/dashboard") {
      return <TrainingDashboard />;
    }
    if (currentPage === "/operational/training/proses") {
      return <ProsesPengajuanTrainingDashboard />;
    }
    if (currentPage === "/operational/pbg/dashboard") {
      return <PBGDashboard />;
    }
    // Operational General Routes
    if (currentPage === "/operational/general/kpi/dashboard") {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === "/operational/general/kpi/master") {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === "/operational/general/kpi/list") {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === "/operational/general/voucher/dashboard") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/operational/general/voucher/proses") {
      return <GeneralProsesVoucherDashboard />;
    }
    if (currentPage === "/operational/general/reimburse/dashboard") {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === "/operational/general/reimburse/proses") {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === "/operational/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/operational/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === "/operational/general/purchase-request/dashboard") {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === "/operational/general/voucher/pertanggungjawaban") {
      return <GeneralPertanggungJawabanVoucherDashboard />;
    }
    if (currentPage === "/operational/general/purchase-request/proses") {
      return <GeneralProsesPurchasingRequest />;
    }
    // NEW Operational General Cuti Routes
    if (currentPage === "/operational/general/cuti/pengajuan") {
      return <GeneralPengajuanCutiDashboard />;
    }
    if (currentPage === "/operational/general/cuti/approve") {
      return <GeneralApproveCutiDashboard />;
    }

    // Finance Routes
    if (currentPage === "/finance/dashboard") {
      return <FinanceMainDashboard />;
    }
    if (currentPage === "/finance/kas/bukti-kas-masuk") {
      return <FinanceBuktiKasMasukDashboard />;
    }
    if (currentPage === "/finance/kas/bukti-kas-keluar") {
      return <FinanceBuktiKasKeluarDashboard />;
    }
    if (currentPage === "/finance/kas/laporan-kas-kecil") {
      return <FinanceLaporanKasKecilDashboard />;
    }
    if (currentPage === "/finance/kas/laporan-outstanding-cash-advance") {
      return <FinanceLaporanOutstandingCADashboard />;
    }
    if (currentPage === "/finance/bank/bukti-bank-masuk") {
      return <FinanceBuktiBankMasukDashboard />;
    }
    if (currentPage === "/finance/bank/bukti-bank-keluar") {
      return <FinanceBuktiBankKeluarDashboard />;
    }
    if (currentPage === "/finance/bank/laporan-bank-harian") {
      return <FinanceLaporanBankHarianDashboard />;
    }
    if (currentPage === "/finance/bank/laporan-bank-harian-khusus") {
      return <FinanceLaporanBankHarianKhususDashboard />;
    }
    if (currentPage === "/finance/permintaan-pencairan-dana") {
      return <FinancePermintaanPencairanDanaDashboard />;
    }
    if (currentPage === "/finance/collection/dashboard-so") {
      return <CollectionDashboardSO />;
    }
    if (currentPage === "/finance/collection/dashboard-proforma-invoice") {
      return <CollectionDashboardProformaInvoice />;
    }
    if (currentPage === "/finance/collection/dashboard-invoice") {
      return <CollectionDashboardInvoice />;
    }
    if (currentPage === "/finance/collection/dashboard-invoice-outstanding") {
      return <CollectionDashboardInvoiceOutstanding />;
    }
    if (currentPage === "/finance/collection/dashboard-cash-in") {
      return <CollectionDashboardCashIn />;
    }
    if (currentPage === "/finance/collection/database-customer") {
      return <CollectionDatabaseCustomer />;
    }
    if (currentPage === "/finance/tanda-terima-dokumeni") {
      return <FinanceTandaTerimaDokumeniDashboard />;
    }
    if (currentPage === "/finance/ap/dashboard") {
      return <APDashboard />;
    }
    if (currentPage === "/finance/ap/laporan") {
      return <LaporanAPDashboard />;
    }
    if (currentPage === "/finance/ap/laporan-outstanding-hutang") {
      return <LaporanAPDashboard />;
    }
    if (currentPage === "/finance/ap/laporan-pembayaran-hutang") {
      return <FinanceLaporanPembayaranHutangDashboard />;
    }
    if (currentPage === "/finance/reimburse-voucher") {
      return <ReimburseVoucherDashboard />;
    }
    if (currentPage === "/finance/ar/dashboard") {
      return <ARDashboard />;
    }
    if (currentPage === "/finance/ar/proses-pembayaran") {
      return <ProsesPembayaranARDashboard />;
    }
    if (currentPage === "/finance/ar/laporan") {
      return <LaporanARDashboard />;
    }
    if (currentPage === "/finance/ap/pembayaran-gaji") {
      return <FinancePembayaranGajiPage />;
    }
    if (currentPage === "/finance/approval/tiket") {
      return <ApprovalTiketDashboard />;
    }
    if (currentPage === "/finance/approval/invoice") {
      return <ApprovalInvoiceDashboard />;
    }
    if (currentPage === "/finance/approval/penggajian") {
      return <ApprovalPenggajianDashboard />;
    }
    if (currentPage === "/finance/approval/po-training") {
      return <ApprovalPOTrainingDashboard />;
    }
    if (currentPage === "/finance/approval/voucher") {
      return <ApprovalVoucherDashboard />;
    }
    if (currentPage === "/finance/voucher/daftar-pembayaran") {
      return <DaftarPembayaranDashboard />;
    }
    if (currentPage === "/finance/voucher/daftar-voucher") {
      return <DaftarVoucherDashboard />;
    }
    if (currentPage === "/finance/voucher/laporan-hutang-usaha") {
      return <LaporanHutangUsahaDashboard />;
    }

    // Management Routes
    if (currentPage === "/management/dashboard") {
      return <ManagementMainDashboard />;
    }
    if (currentPage === "/management/approve-kontrak") {
      return <KontrakKerjaDashboard role="management" />;
    }
    if (currentPage === "/management/penggajian") {
      return <PengajianActiveDashboard role="management" />;
    }
    if (currentPage === "/management/training") {
      return <ProsesPengajuanTrainingDashboard role="management" />;
    }
    if (currentPage === "/management/po/jasa") {
      return <POJasaDashboard role="management" />; // Pass role prop
    }
    if (currentPage === "/management/po/barang") {
      return <POBarangDashboard role="management" />;
    }
    // QHSE Routes
    if (currentPage === "/qhse/dashboard") {
      return <QHSENewDashboard />;
    }
    if (currentPage === "/qhse/perizinan-alat") {
      return <PerizinanAlatDashboard />;
    }
    if (currentPage === "/qhse/performance") {
      return <QHSEPerformanceDashboard />;
    }
    if (currentPage === "/qhse/monitoring-mcu") {
      return <MonitoringMCUDashboard />;
    }
    if (currentPage === "/qhse/monitoring-daftar-alat-ukur") {
      return <MonitoringDaftarAlatUkurDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel") {
      return <MonitoringPersonnelDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/training-matrix") {
      return <TrainingMatrixDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/mcu") {
      return <MedicalCheckUpDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/apd") {
      return <APDDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/nomor-report") {
      return <NomorReportDashboard />;
    }
    if (currentPage === "/qhse/monitoring/pr") {
      return <MonitoringPRDashboard />;
    }
    if (currentPage === "/qhse/monitoring/cash-advance") {
      return <MonitoringCADashboard />;
    }
    if (currentPage === "/qhse/monitoring/voucher") {
      return <MonitoringVoucherDashboard />;
    }
    if (currentPage === "/qhse/monitoring/endorse-certificate") {
      return <MonitoringEndorseCertificateDashboard />;
    }
    if (currentPage === "/qhse/monitoring/reimburse") {
      return <MonitoringReimburseDashboard />;
    }
    if (currentPage === "/qhse/monitoring-gudang/manifest-barang") {
      return <MonitoringManifestBarangDashboard />;
    }
    if (currentPage === "/qhse/monitoring-gudang/pbg") {
      return <MonitoringPBGDashboard />;
    }
    if (currentPage === "/qhse/monitoring-gudang/rfi") {
      return <MonitoringRFIDashboard />;
    }
    if (currentPage === "/qhse/radiography/monitoring-kamera-radiography") {
      return <RadiographyMonitoringKameraDashboard />;
    }
    if (currentPage === "/qhse/radiography/sib-personnel-radiasi") {
      return <RadiographySIBPersonnelRadiasiDashboard />;
    }
    if (currentPage === "/qhse/radiography/dosimeter-saku") {
      return <RadiographyDosimeterSakuDashboard />;
    }
    if (currentPage === "/qhse/radiography/surveymeter") {
      return <RadiographySurveymeterDashboard />;
    }
    if (currentPage === "/qhse/radiography/tld-badge") {
      return <RadiographyTLDBadgeDashboard />;
    }
    if (currentPage === "/qhse/radiography/uji-usap-kamera") {
      return <RadiographyUjiUsapKameraDashboard />;
    }
    if (currentPage === "/qhse/radiography/kontrak-sib") {
      return <RadiographyKontrakSIBDashboard />;
    }
    if (currentPage === "/qhse/monitoring-training") {
      return <MonitoringTrainingDashboard />;
    }
    if (currentPage === "/qhse/audit") {
      return <AuditDashboard />;
    }
    if (currentPage === "/qhse/monitoring-isotop") {
      return <MonitoringISOTOPDashboard />;
    }
    if (currentPage === "/qhse/monitoring-pti") {
      return <MonitoringPTIDashboard />;
    }
    if (currentPage === "/qhse/monitoring-alat-safety") {
      return <MonitoringAlatSafetyDashboard />;
    }
    if (currentPage === "/qhse/jadwal-realisasi-program") {
      return <JadwalRealisasiProgramDashboard />;
    }
    if (currentPage === "/qhse/legalitas-perusahaan") {
      return <LegalitasPerusahaanDashboard />;
    }
    if (currentPage === "/qhse/general/kpi/master") {
      return <QHSEMasterKPIDashboard />;
    }
    if (currentPage === "/qhse/general/kpi/list") {
      return <QHSEListKPIDashboard />;
    }

    // Accounting Routes
    if (currentPage === "/accounting/dashboard") {
      return <AccountingMainDashboard />;
    }
    if (currentPage === "/accounting/master-coa") {
      return <MasterCOADashboard />;
    }
    if (currentPage === "/accounting/kas-masuk") {
      return <KasMasukDashboard />;
    }
    if (currentPage === "/accounting/kas-keluar") {
      return <KasKeluarDashboard />;
    }
    if (currentPage === "/accounting/bank-masuk") {
      return <BankMasukDashboard />;
    }
    if (currentPage === "/accounting/bank-keluar") {
      return <BankKeluarDashboard />;
    }
    if (currentPage === "/accounting/posting-jurnal") {
      return <PostingJurnalDashboard />;
    }
    if (currentPage === "/accounting/laporan-jurnal") {
      return <LaporanJurnalDashboard />;
    }
    if (currentPage === "/accounting/tutup-buku") {
      return <TutupBukuDashboard />;
    }
    if (currentPage === "/accounting/laba-rugi") {
      return <LabaRugiDashboard />;
    }
    if (currentPage === "/accounting/neraca") {
      return <NeracaDashboard />;
    }

    // Tax Routes
    if (currentPage === "/tax/dashboard") {
      return <TaxMainDashboard />;
    }
    if (currentPage === "/tax/pajak-masukan") {
      return <PajakMasukanDashboard />;
    }
    if (currentPage === "/tax/pajak-keluaran") {
      return <PajakKeluaranDashboard />;
    }
    if (currentPage === "/tax/pph-21") {
      return <PPh21Dashboard />;
    }

    // Procon Routes
    if (currentPage === "/procon/dashboard") {
      return <ProconMainDashboard />;
    }
    if (currentPage === "/procon/invoice") {
      return <ProconInvoiceDashboard />;
    }
    if (currentPage === "/procon/overview") {
      return <ProconOverviewDashboard />;
    }
    // Procon Laporan Routes
    if (currentPage === "/procon/laporan/laba-rugi") {
      return <LaporanLabaRugi />;
    }
    if (currentPage === "/procon/laporan/per-so") {
      return <LaporanPerSO />;
    }

    // Procon Approval Routes
    if (currentPage === "/procon/approval/po-jasa") {
      return <POJasaDashboard role="management" />; // Pass role prop
    }
    if (currentPage === "/procon/approval/timesheet") {
      return <ApprovalTimesheet />;
    }

    // Default to main dashboard
    return renderMainDashboard();
  };

  return renderPageContent();
};

export default Dashboard;
