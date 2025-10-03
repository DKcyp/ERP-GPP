import FinanceAPTresuriDashboard from "./FinanceAPTresuriDashboard";
import FinanceLaporanHutangDashboard from "./FinanceLaporanHutangDashboard";
import FinancePengajuanDanaHutangDashboard from "./FinancePengajuanDanaHutangDashboard";
import FinancePembayaranHutangDashboard from "./FinancePembayaranHutangDashboard";
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
import TimesheetBarangPegawaiDashboard from "./TimesheetBarangPegawaiDashboard";
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
import PengajuanLemburDashboard from "./PengajuanLemburDashboard";
import DaftarPegawaiDashboard from "./DaftarPegawaiDashboard";
import KontrakPegawaiDashboard from "./KontrakPegawaiDashboard";
import MonitoringKontrakPegawaiDashboard from "./MonitoringKontrakPegawaiDashboard";
import MasterUMRDashboard from "./MasterUMRDashboard";
import MasterKualifikasiDashboard from "./MasterKualifikasiDashboard";
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
import PODashboard from "./PODashboard";
import ListPRDashboard from "./ListPRDashboard";
import DaftarPenerimaanBarangDashboard from "./DaftarPenerimaanBarangDashboard";
import PenerimaanBarangDashboard from "./PenerimaanBarangDashboard";
import PurchasingDashboard from "./PurchasingDashboard";
import InvoiceDashboard from "./InvoiceDashboard";
import GudangDashboard from "./GudangDashboard";
import DaftarSeleksiSupplierBiddingDashboard from "./DaftarSeleksiSupplierBiddingDashboard";
import ApprovalTiketDashboard from "./ApprovalTiketDashboard";
import ApprovalInvoiceDashboard from "./ApprovalInvoiceDashboard";
import ApprovalPenggajianDashboard from "./ApprovalPenggajianDashboard";
import ApprovalPOTrainingDashboard from "./ApprovalPOTrainingDashboard";
import ApprovalVoucherDashboard from "./ApprovalVoucherDashboard";
import ApprovalVoucherDashboardManajement from "./ApprovalVoucherDashboardManajement";
import DaftarPembayaranDashboard from "./DaftarPembayaranDashboard";
import ProconLRPExcelDashboard from "./ProconLRPExcelDashboard";
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
import FinanceLaporanKasBankHarianDashboard from "./FinanceLaporanKasBankHarianDashboard";
import FinancePermintaanPencairanDanaDashboard from "./FinancePermintaanPencairanDanaDashboard";
import FinanceVoucherDashboard from "./FinanceVoucherDashboard";
import FinanceKasBankEntryDashboard from "./FinanceKasBankEntryDashboard";
import FinanceLaporanKasDashboard from "./FinanceLaporanKasDashboard";
import FinanceLaporanBankDashboard from "./FinanceLaporanBankDashboard";

import FinanceApprovalVoucherDashboard from "./FinanceApprovalVoucherDashboard";
import FinanceApprovalReimburseDashboard from "./FinanceApprovalReimburseDashboard";
import FinancePengajuanHutangUsahaDashboard from "./FinancePengajuanHutangUsahaDashboard";
import FinancePengajuanVoucherDashboard from "./FinancePengajuanVoucherDashboard";
import FinanceApprovalPTJVoucherDashboard from "./FinanceApprovalPTJVoucherDashboard";
import FinanceARInvoiceDashboard from "./FinanceARInvoiceDashboard";
import FinanceLaporanARDashboard from "./FinanceLaporanARDashboard";
import CollectionDashboardSO from "./CollectionDashboardSO";
import CollectionDashboardProformaInvoice from "./CollectionDashboardProformaInvoice";
import CollectionDashboardInvoice from "./CollectionDashboardInvoice";
import CollectionDashboardInvoiceOutstanding from "./CollectionDashboardInvoiceOutstanding";
import CollectionDatabaseCustomer from "./CollectionDatabaseCustomer";
import CollectionDashboardCashIn from "./CollectionDashboardCashIn";
import FinanceTandaTerimaDokumeniDashboard from "./FinanceTandaTerimaDokumeniDashboard";
import FinanceTandaTerimaDokumenPembelianDashboard from "./FinanceTandaTerimaDokumenPembelianDashboard";
import JurnalManualDashboard from "./JurnalManualDashboard";
import JurnalRasioKeuanganDashboard from "./JurnalRasioKeuanganDashboard";
import AssetDashboard from "./AssetDashboard";
import TrialBalanceDashboard from "./TrialBalanceDashboard";
import AccountingAssetMasterKategoriDashboard from "./AccountingAssetMasterKategoriDashboard";
import AccountingAssetAktivasiDashboard from "./AccountingAssetAktivasiDashboard";
import BukuBesarDashboard from "./BukuBesarDashboard";
import AccountingPph21KaryawanDashboard from "./AccountingPph21KaryawanDashboard";
import AccountingPph21NonKaryawanDashboard from "./AccountingPph21NonKaryawanDashboard";

// Gudang Dashboards
import MasterBarangDashboard from "./MasterBarangDashboard";
import KategoriBarangDashboard from "./KategoriBarangDashboard";
import SatuanBarangDashboard from "./SatuanBarangDashboard";
import ExpiredBarangDashboard from "./ExpiredBarangDashboard";
import RestockExpiredBarangDashboard from "./RestockExpiredBarangDashboard";
import StockBarangDashboard from "./StockBarangDashboard";
import GudangProyekDashboard from "./GudangProyekDashboard";
import PenerimaanBarangMasukDashboard from "./PenerimaanBarangMasukDashboard";
import PenerimaanBarangManualDashboard from "./PenerimaanBarangManualDashboard";
import TrackingDokumenMonitoringDashboard from "./TrackingDokumenMonitoringDashboard";
import MutasiBarangDashboard from "./MutasiBarangDashboard";
import PengembalianBarangDashboard from "./PengembalianBarangDashboard";
import BarangKarantinaDashboard from "./BarangKarantinaDashboard";
import BarangDibuangDashboard from "./BarangDibuangDashboard";
import TimesheetBarangGudangDashboard from "./TimesheetBarangGudangDashboard";
import ApprovalTimesheetBarangDashboard from "./ApprovalTimesheetBarangDashboard";
import StockOpnameDashboard from "./StockOpnameDashboard";
import VerifikasiStockOpnameDashboard from "./VerifikasiStockOpnameDashboard";
import LaporanSemuaStockDashboard from "./LaporanSemuaStockDashboard";
import MonitoringAlatProyekDashboard from "./MonitoringAlatProyekDashboard";
import PermintaanBarangGudangDashboard from "./PermintaanBarangGudangDashboard";
import KartuStockDashboard from "./KartuStockDashboard";
import LaporanEvaluasiVendorDashboard from "./LaporanEvaluasiVendorDashboard";
import GudangMainDashboard from "./GudangMainDashboard";
import BarangRusakDashboardPage from "../pages/gudang/BarangRusakDashboardPage";
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
import GeneralPengajuanTicketDashboard from "./GeneralPengajuanTicketDashboard"; // NEW: General Pengajuan Ticket
import FinanceApprovalTicketDashboard from "./FinanceApprovalTicketDashboard"; // NEW: Finance Approval Ticket
import HRDTrainingListDashboard from "./HRDTrainingListDashboard"; // NEW: HRD List Training
import HRDTNADashboard from "./HRDTNADashboard"; // NEW: HRD TNA
import PendebetanDashboard from "./PendebetanDashboard";
import PayslipDashboard from "./PayslipDashboard";
import MasterIncomeDashboard from "./MasterIncomeDashboard";
import MasterDeductDashboard from "./MasterDeductDashboard";
import PotonganLainDashboard from "./PotonganLainDashboard";
import CalendarAbsensiDashboard from "./CalendarAbsensiDashboard";
import PengajuanIzinDashboard from "./PengajuanIzinDashboard";
import MasterIzinDashboard from "./MasterIzinDashboard";
import PengajuanPegawaiBaruDashboard from "./PengajuanPegawaiBaruDashboard";
import PerjanjianIkatanDinasDashboard from "./PerjanjianIkatanDinasDashboard";
import SuratIzinBekerjaDashboard from "./SuratIzinBekerjaDashboard";
import NoSuratPerjanjianDashboard from "./NoSuratPerjanjianDashboard";
import HRDMonitoringDokumenDashboard from "./HRDMonitoringDokumenDashboard";

// QHSE Dashboards
import QHSENewDashboard from "./QHSENewDashboard";
import PerizinanAlatDashboard from "./PerizinanAlatDashboard";
import MonitoringMCUDashboard from "./MonitoringMCUDashboard";
import MonitoringTrainingDashboard from "./MonitoringTrainingDashboard";
import AuditDashboard from "./AuditDashboard";
import MonitoringISOTOPDashboard from "./MonitoringISOTOPDashboard";
import MonitoringPTIDashboard from "./MonitoringPTIDashboard";
import MonitoringAlatSafetyDashboard from "./MonitoringAlatSafetyDashboard";
import SPDashboard from "./SPDashboard";
import JadwalRealisasiProgramDashboard from "./JadwalRealisasiProgramDashboard";
import LegalitasPerusahaanDashboard from "./LegalitasPerusahaanDashboard";
import ManagementKompetensiPerusahaanDashboard from "./ManagementKompetensiPerusahaanDashboard";
import QHSEPerformanceDashboard from "./QHSEPerformanceDashboard";
import QHSEKameraRadiographyDashboard from "./QHSEKameraRadiographyDashboard";
import RadiographyMonitoringKameraDashboard from "./RadiographyMonitoringKameraDashboard";
import RadiographySIBPersonnelRadiasiDashboard from "./RadiographySIBPersonnelRadiasiDashboard";
import RadiographyDosimeterSakuDashboard from "./RadiographyDosimeterSakuDashboard";
import RadiographySurveymeterDashboard from "./RadiographySurveymeterDashboard";
import RadiographyTLDBadgeDashboard from "./RadiographyTLDBadgeDashboard";
import RadiographyUjiUsapKameraDashboard from "./RadiographyUjiUsapKameraDashboard";
import RadiographyKontrakSIBDashboard from "./RadiographyKontrakSIBDashboard";
import MonitoringDaftarAlatUkurDashboard from "./MonitoringDaftarAlatUkurDashboard";
import QHSEDaftarAlatUkurDashboard from "./QHSEDaftarAlatUkurDashboard";
import MonitoringPersonnelDashboard from "./MonitoringPersonnelDashboard";
import TrainingMatrixDashboard from "./TrainingMatrixDashboard";
import MedicalCheckUpDashboard from "./MedicalCheckUpDashboard";
import QHSEMedicalCheckUpPersonilDashboard from "./QHSEMedicalCheckUpPersonilDashboard";
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
import QHSEKompetensiPersonilDashboard from "./QHSEKompetensiPersonilDashboard";
import QHSEAlatPelindungDiriDashboard from "./QHSEAlatPelindungDiriDashboard";
import QHSEMonitoringAPDDashboard from "./QHSEMonitoringAPDDashboard";
import QHSEDaftarIndukDokumenEksternalDashboard from "./QHSEDaftarIndukDokumenEksternalDashboard";
import QHSEApprovalRFIDashboard from "./QHSEApprovalRFIDashboard";
// New QHSE Components
import KameraDashboard from "./KameraDashboard";
import SIBPersonilDashboard from "./SIBPersonilDashboard";
import QHSEKartuDosisDashboard from "./QHSEKartuDosisDashboard";
import DosisCardDashboard from "./DosisCardDashboard";
import RadiographyDashboard from "./RadiographyDashboard";
import ProsesISOTOPDashboard from "./ProsesISOTOPDashboard";
import RadiographyMonitoringDashboard from "./RadiographyMonitoringDashboard";
import PengadaanQHSEDashboard from "./PengadaanQHSEDashboard";
import HydroTestDashboard from "./HydroTestDashboard";
import MatrixTrainingDashboard from "./MatrixTrainingDashboard";
import MonitoringReportDashboard from "./MonitoringReportDashboard";
import ProconApprovalPBGDashboard from "./ProconApprovalPBGDashboard";
import ISOSystemDaftarIndukDokumenInternalDashboard from "./ISOSystemDaftarIndukDokumenInternalDashboard";
import QHSELogBookTLDDashboard from "./QHSELogBookTLDDashboard";
import QHSEGeneralISOSystemDashboard from "./QHSEGeneralISOSystemDashboard";
import QHSEKartuPemantauanKesehatanDashboard from "./QHSEKartuPemantauanKesehatanDashboard";
import QHSEMonitoringPersonilDashboard from "./QHSEMonitoringPersonilDashboard";
import QHSELogBookTKPKDashboard from "./QHSELogBookTKPKDashboard";

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
import ReconcilliationMatchDashboard from "./ReconcilliationMatchDashboard";
import ReconcilliationUnmatchDashboard from "./ReconcilliationUnmatchDashboard";

// Tax Dashboards
import TaxMainDashboard from "./TaxMainDashboard";
import PajakMasukanDashboard from "./PajakMasukanDashboard";
import PajakKeluaranDashboard from "./PajakKeluaranDashboard";
import PPh21Dashboard from "./PPh21Dashboard";
import PPh23Dashboard from "./PPh23Dashboard";
import PPh4Ayat2Dashboard from "./PPh4Ayat2Dashboard";
import PPh22Dashboard from "./PPh22Dashboard";
import PPh29Dashboard from "./PPh29Dashboard";
import PPh25Dashboard from "./PPh25Dashboard";
import SKPKBDashboard from "./SKPKBDashboard";
import SP2DKDashboard from "./SP2DKDashboard";
import STPDashboard from "./STPDashboard";
import FinancePajakRekonsiliasiMasukanDashboard from "./FinancePajakRekonsiliasiMasukanDashboard";
import FinancePajakRekonsiliasiKeluaranDashboard from "./FinancePajakRekonsiliasiKeluaranDashboard";
import FinancePajakProsesHutangDashboard from "./FinancePajakProsesHutangDashboard";
import TaxDashboard from "./TaxDashboard";

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
import ApprovalTimesheet from "../pages/procon/approval/ApprovalTimesheet";

// GA Template
import GATemplate from "./GATemplate";
import GAKendaraanMasterDashboard from "./GAKendaraanMasterDashboard";
import GAPajakKendaraanDashboard from "./GAPajakKendaraanDashboard";
import GALegalitasPerusahaanDashboard from "./GALegalitasPerusahaanDashboard";
import GAPerformanceDashboard from "./GAPerformanceDashboard";
import GABASerahTerimaAssetDashboard from "./GABASerahTerimaAssetDashboard";
// GA Monitoring pages
import GAMonitoringSaprasDashboard from "./GAMonitoringSaprasDashboard";
import GAMonitoringKendaraanDashboard from "./GAMonitoringKendaraanDashboard";
import GAPermintaanDriverApprovalDashboard from "./GAPermintaanDriverApprovalDashboard";
import GAServiceKendaraanDashboard from "./GAServiceKendaraanDashboard";
import GAMaintenanceSaprasDashboard from "./GAMaintenanceSaprasDashboard";
import GAUtilityDashboard from "./GAUtilityDashboard";
import GAATKStockDashboard from "./GAATKStockDashboard";
import GAATKRequestDashboard from "./GAATKRequestDashboard";
import GABackupDataUserDashboard from "./GABackupDataUserDashboard";
import GAITTroubleShootDashboard from "./GAITTroubleShootDashboard";
import GAITMaintenanceDeviceDashboard from "./GAITMaintenanceDeviceDashboard";
import GAITMonitoringServerDashboard from "./GAITMonitoringServerDashboard";
import GAPajakPBBDashboard from "./GAPajakPBBDashboard";
import GAIuranKeanggotaanDashboard from "./GAIuranKeanggotaanDashboard";
import GAMasterAsetDashboard from "./GAMasterAsetDashboard";

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
import MasterDataCustomerDashboard from "./MasterDataCustomerDashboard";
import MonitoringMarketingDashboard from "./MonitoringMarketingDashboard";
import ManagementMonitoringMarketingDashboard from "./ManagementMonitoringMarketingDashboard";
import ManagementMonitoringPembelianDashboard from "./ManagementMonitoringPembelianDashboard";
import ManagementMonitoringPenjualanDashboard from "./ManagementMonitoringPenjualanDashboard";
import CSIMasterDashboard from "./CSIMasterDashboard";
import CSIPenilaianFormDashboard from "./CSIPenilaianFormDashboard";
import PerjalananDinasDashboard from "./PerjalananDinasDashboard";
import PengajuanPerjalananDinasDashboard from "./PengajuanPerjalananDinasDashboard";
import MonitoringBidbond from "./MonitoringBidbond";
import MonitoringPerformanceBond from "./MonitoringPerformanceBond";
import MonitoringLegalitasPerusahaan from "./MonitoringLegalitasPerusahaan";
import MonitoringTKDNDashboard from "./MonitoringTKDNDashboard";
import MonitoringPenilaianTKDNDashboard from "./MonitoringPenilaianTKDNDashboard";
import GeneralBudgetPengajuanDashboard from "./GeneralBudgetPengajuanDashboard";
import GeneralBudgetLaporanDashboard from "./GeneralBudgetLaporanDashboard";
import GeneralPengajuanResignDashboard from "./GeneralPengajuanResignDashboard";
import AuditTrailDashboard from "./AuditTrailDashboard"; // Import the new Audit Trail component

// General Kendaraan
import GeneralKendaraanPengajuanDriver from "./GeneralKendaraanPengajuanDriver";
import GeneralKendaraanLogbookDriver from "./GeneralKendaraanLogbookDriver";
import GeneralKendaraanApprovalDriver from "./GeneralKendaraanApprovalDriver";

import { Calendar } from "lucide-react";
import PembagianAPDRecordDashboard from "./PembagianAPDRecordDashboard";
import PerundanganK3LDashboard from "./PerundanganK3LDashboard";
import DaftarIndukRekamanInternalDashboard from "./DaftarIndukRekamanInternalDashboard";
import QHSEKPIDepartmentDashboard from "./QHSEKPIDepartmentDashboard";
import QHSEKompetensiPerusahaanDashboard from "./QHSEKompetensiPerusahaanDashboard";
import QHSELogBookRATDashboard from "./QHSELogBookRATDashboard";
import QHSEMonitoringKameraRadiographyDashboard from "./QHSEMonitoringKameraRadiographyDashboard";
import QHSEUjiUsapKameraDashboard from "./QHSEUjiUsapKameraDashboard";
import QHSEDaftarIndukDokumenInternalDashboard from "./QHSEDaftarIndukDokumenInternalDashboard";
import QHSEMonitoringPersonnelReportDashboard from "./QHSEMonitoringPersonnelReportDashboard";
import QHSEDaftarInventarisIsotopDashboard from "./QHSEDaftarInventarisIsotopDashboard";

// QHSE Expired Barang Components
import QHSEExpiredBarangBADashboard from "./QHSEExpiredBarangBADashboard";
import QHSEExpiredBarangApprovalDashboard from "./QHSEExpiredBarangApprovalDashboard";
import QHSEExpiredBarangHasilApprovedDashboard from "./QHSEExpiredBarangHasilApprovedDashboard";
import FinanceApprovePIDashboard from "./FinanceApprovePIDashboard";

import MonitoringNilaiPOPage from "../pages/marketing/MonitoringNilaiPOPage";
import MasterAllowancePage from "../pages/hrd/MasterAllowancePage";
import MasterTunjanganHRDDashboard from "./MasterTunjanganHRDDashboard";
import ApprovalLemburDashboard from "./ApprovalLemburDashboard";

interface DashboardProps {
  currentPage: string;
  setCurrentPage?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();
  
  // Debug log to check if setCurrentPage is received
  console.log('Dashboard received setCurrentPage:', !!setCurrentPage);

  // Main dashboard content based on user role
  const renderMainDashboard = () => {
    if (user?.role === "hrd") {
      return <HRDDashboard setCurrentPage={setCurrentPage} />;
    }

    // QHSE ISO System
    if (currentPage === "/qhse/iso/daftar-induk-dokumen-internal") {
      return <ISOSystemDaftarIndukDokumenInternalDashboard />;
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
    // QHSE Radiography - Daftar Inventaris Isotop
    if (currentPage === "/qhse/radiography/qhse/daftar-inventaris-isotop") {
      return <QHSEDaftarInventarisIsotopDashboard />;
    }
    // Management Routes
    if (currentPage === "/manajement/monitoring-pembelian") {
      return <ManagementMonitoringPembelianDashboard />;
    }
    if (currentPage === "/manajement/monitoring-penjualan") {
      return <ManagementMonitoringPenjualanDashboard />;
    }
    if (currentPage === "/management/monitoring/marketing") {
      return <ManagementMonitoringMarketingDashboard />;
    }
    if (currentPage === "/management/kompetensi-perusahaan") {
      return <ManagementKompetensiPerusahaanDashboard />;
    }
    // Marketing CSI
    if (currentPage === "/marketing/csi/master") {
      return <CSIMasterDashboard />;
    }
    if (currentPage === "/marketing/csi/form") {
      return <CSIPenilaianFormDashboard />;
    }

    // Marketing > Monitoring > Dokumen
    if (currentPage === "/marketing/monitoring/dokumen/bidbond") {
      return <MonitoringBidbond />;
    }
    if (currentPage === "/marketing/monitoring/dokumen/performance-bond") {
      return <MonitoringPerformanceBond />;
    }
    if (currentPage === "/marketing/monitoring/dokumen/legalitas-perusahaan") {
      return <MonitoringLegalitasPerusahaan />;
    }
    if (currentPage === "/marketing/monitoring/tkdn") {
      return <MonitoringTKDNDashboard />;
    }
    if (currentPage === "/marketing/monitoring/penilaian-tkdn") {
      return <MonitoringPenilaianTKDNDashboard />;
    }
    if (currentPage === "/marketing/monitoring/nilai-po") {
      return <MonitoringNilaiPOPage />;
    }

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
    if (currentPage === "/gudang/penerimaan-barang-manual/dashboard") {
      return <PenerimaanBarangManualDashboard />;
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
    if (currentPage === "/gudang/kartu-stock/dashboard") {
      return <KartuStockDashboard />;
    }
    if (currentPage === "/gudang/timesheet-barang/approval") {
      return <ApprovalTimesheetBarangDashboard />;
    }
    if (currentPage === "/gudang/barang-rusak/dashboard") {
      return <BarangRusakDashboardPage />;
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

    // Generic Audit Trail Route for all roles
    if (currentPage.endsWith("/general/audit-trail")) {
      return <AuditTrailDashboard />;
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
    if (currentPage === "/gudang/general/absensi/pengajuan-resign") {
      return <GeneralPengajuanResignDashboard />;
    }
    if (currentPage === "/gudang/general/budget/pengajuan") {
      return <GeneralBudgetPengajuanDashboard />;
    }
    if (currentPage === "/gudang/general/budget/laporan") {
      return <GeneralBudgetLaporanDashboard />;
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
    // NEW Gudang General Ticket Routes
    if (currentPage === "/gudang/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
    }
    // Gudang General Kendaraan
    if (currentPage === "/gudang/general/kendaraan/pengajuan-driver") {
      return <GeneralKendaraanPengajuanDriver />;
    }
    if (currentPage === "/gudang/general/kendaraan/logbook-driver") {
      return <GeneralKendaraanLogbookDriver />;
    }
    if (currentPage === "/gudang/general/kendaraan/approval-driver") {
      return <GeneralKendaraanApprovalDriver />;
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
    if (currentPage === "/ga/general/absensi/pengajuan-resign") {
      return <GeneralPengajuanResignDashboard />;
    }
    if (currentPage === "/ga/general/budget/pengajuan") {
      return <GeneralBudgetPengajuanDashboard />;
    }
    if (currentPage === "/ga/general/budget/laporan") {
      return <GeneralBudgetLaporanDashboard />;
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
    // NEW ga General Ticket Routes
    if (currentPage === "/ga/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
    }
    if (currentPage === "/ga/general/utility/dashboard") {
      return <GeneralUtilityDashboard />;
    }
    // GA General Kendaraan
    if (currentPage === "/ga/general/kendaraan/pengajuan-driver") {
      return <GeneralKendaraanPengajuanDriver />;
    }
    if (currentPage === "/ga/general/kendaraan/logbook-driver") {
      return <GeneralKendaraanLogbookDriver />;
    }
    if (currentPage === "/ga/general/kendaraan/approval-driver") {
      return <GeneralKendaraanApprovalDriver />;
    }

    // Pengadaan Routes
    if (currentPage === "/pengadaan/dashboard") {
      return <PengadaanDashboard />;
    }
    if (currentPage === "/pengadaan/penerimaan-barang") {
      return <PenerimaanBarangDashboard />;
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
    if (currentPage === "/pengadaan/vendor/laporan") {
      return <LaporanEvaluasiVendorDashboard />;
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
    if (currentPage === "/pengadaan/penerimaan") {
      return <PenerimaanBarangDashboard />;
    }
    if (currentPage === "/pengadaan/po/approval_pr") {
      return <ListPRDashboard />;
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
    if (currentPage === "/pengadaan/tracking/monitoring") {
      return <TrackingDokumenMonitoringDashboard />;
    }
    // Operational Man Power - Pengajuan Pegawai Baru
    if (currentPage === "/operational/man-power/pengajuan-pegawai-baru") {
      return <PengajuanPegawaiBaruDashboard />;
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
    // Pengadaan General Kendaraan
    if (currentPage === "/pengadaan/general/kendaraan/pengajuan-driver") {
      return <GeneralKendaraanPengajuanDriver />;
    }
    if (currentPage === "/pengadaan/general/kendaraan/logbook-driver") {
      return <GeneralKendaraanLogbookDriver />;
    }
    if (currentPage === "/pengadaan/general/kendaraan/approval-driver") {
      return <GeneralKendaraanApprovalDriver />;
    }
    if (currentPage === "/pengadaan/general/cash-advance/dashboard") {
      return <GeneralCashAdvanceDashboard />;
    }
    if (currentPage === "/pengadaan/general/cash-advance/proses") {
      return <GeneralProsesCashAdvance />;
    }

    // Generic handler for General > Absensi > Pengajuan Perjalanan Dinas across roles
    if (currentPage.endsWith("/general/absensi/pengajuan-perjalanan-dinas")) {
      return <PengajuanPerjalananDinasDashboard />;
    }
    if (currentPage === "/pengadaan/general/absensi/pengajuan-resign") {
      return <GeneralPengajuanResignDashboard />;
    }
    if (currentPage === "/pengadaan/general/budget/pengajuan") {
      return <GeneralBudgetPengajuanDashboard />;
    }
    if (currentPage === "/pengadaan/general/budget/laporan") {
      return <GeneralBudgetLaporanDashboard />;
    }
    if (currentPage === "/hrd/general/budget/pengajuan") {
      return <GeneralBudgetPengajuanDashboard />;
    }
    if (currentPage === "/hrd/general/budget/laporan") {
      return <GeneralBudgetLaporanDashboard />;
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
    // NEW Pengadaan General Ticket Routes
    if (currentPage === "/pengadaan/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
    }

    // HRD Routes
    if (currentPage === "/hrd/dashboard") {
      return <HRDDashboard setCurrentPage={setCurrentPage} />;
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
    if (currentPage === "/hrd/rekrutmen/master-kualifikasi") {
      return <MasterKualifikasiDashboard />;
    }
    if (currentPage === "/hrd/rekrutmen/master-tunjangan") {
      return <MasterTunjanganHRDDashboard />;
    }
    if (currentPage === "/hrd/marketing/dashboard") {
      return <HRDMarketingDashboard />;
    }
    if (currentPage === "/hrd/lembur/dashboard") {
      return <LemburDashboard />;
    }
    if (currentPage === "/hrd/allowance/perjalanan-dinas") {
      return <PerjalananDinasDashboard />;
    }
    if (currentPage === "/hrd/allowance/master") {
      return <MasterAllowancePage />;
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
    if (currentPage === "/hrd/training/list") {
      return <HRDTrainingListDashboard />;
    }
    if (currentPage === "/hrd/training/tna") {
      return <HRDTNADashboard />;
    }

    if (currentPage === "/hrd/gaji/daftar") {
      return <DaftarGajiDashboard />;
    }
    if (currentPage === "/hrd/gaji/master-income") {
      return <MasterIncomeDashboard />;
    }
    if (currentPage === "/hrd/gaji/master-deduct") {
      return <MasterDeductDashboard />;
    }
    if (currentPage === "/hrd/gaji/pengajian") {
      return <PengajianActiveDashboard />;
    }
    if (currentPage === "/hrd/gaji/potongan") {
      return <PotonganGajiDashboard />;
    }
    if (currentPage === "/hrd/gaji/potongan-lain") {
      return <PotonganLainDashboard />;
    }
    if (currentPage === "/hrd/gaji/pendebetan") {
      return <PendebetanDashboard />;
    }
    if (currentPage === "/hrd/gaji/payslip") {
      return <PayslipDashboard />;
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
    if (currentPage === "/hrd/absensi/kalender") {
      return <CalendarAbsensiDashboard />;
    }
    if (currentPage === "/hrd/absensi/pengajuan-izin") {
      return <PengajuanIzinDashboard />;
    }
    if (currentPage === "/hrd/absensi/master-izin") {
      return <MasterIzinDashboard />;
    }
    if (currentPage === "/hrd/absensi/approval-lembur") {
      return <ApprovalLemburDashboard />;
    }
    if (currentPage === "/hrd/perjanjian/perjanjian-ikatan-dinas") {
      return <PerjanjianIkatanDinasDashboard />;
    }
    if (currentPage === "/hrd/perjanjian/surat-izin-bekerja") {
      return <SuratIzinBekerjaDashboard />;
    }
    if (currentPage === "/hrd/perjanjian/no-surat") {
      return <NoSuratPerjanjianDashboard />;
    }
    if (currentPage === "/hrd/monitoring/dokumen") {
      return <HRDMonitoringDokumenDashboard />;
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
    // NEW: Route for SP Penilaian HRD
    if (currentPage === "/hrd/penilaian/sp") {
      return <SPDashboard />;
    }
    // NEW: Route for Approve SPK
    if (currentPage === "/hrd/spk/approve") {
      return <ApproveSPKDashboard />;
    }
    if (currentPage === "/hrd/monitoring/endorse-certificate") {
      return <MonitoringEndorseCertificateHRD />;
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
    // HRD General Kendaraan
    if (currentPage === "/hrd/general/kendaraan/pengajuan-driver") {
      return <GeneralKendaraanPengajuanDriver />;
    }
    if (currentPage === "/hrd/general/kendaraan/logbook-driver") {
      return <GeneralKendaraanLogbookDriver />;
    }
    if (currentPage === "/hrd/general/kendaraan/approval-driver") {
      return <GeneralKendaraanApprovalDriver />;
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
    if (currentPage === "/hrd/general/absensi/pengajuan-resign") {
      return <GeneralPengajuanResignDashboard />;
    }
    if (currentPage === "/hrd/general/absensi/pengajuan-lembur") {
      return <PengajuanLemburDashboard />;
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
    // NEW HRD General Ticket Routes
    if (currentPage === "/hrd/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
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
    if (currentPage === "/marketing/master/master-data-customer") {
      return <MasterDataCustomerDashboard />;
    }
    if (currentPage === "/marketing/monitoring/marketing") {
      return <MonitoringMarketingDashboard />;
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
    if (currentPage === "/procon/operation/produksi") {
      return <ProduksiDashboard />;
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
    if (currentPage === "/procon/lrp") {
      return <ProconLRPExcelDashboard />;
    }
    if (currentPage === "/procon/hpp-induk/dashboard") {
      return <ProconHPPIndukDashboard />;
    }
    // Procon Laba Rugi Project (LRP)
    if (currentPage === "/procon/lrp/dashboard") {
      return <ProconLRPExcelDashboard />;
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
    // NEW Procon General Ticket Routes
    if (currentPage === "/procon/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
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
    // Marketing General Kendaraan
    if (currentPage === "/marketing/general/kendaraan/pengajuan-driver") {
      return <GeneralKendaraanPengajuanDriver />;
    }
    if (currentPage === "/marketing/general/kendaraan/logbook-driver") {
      return <GeneralKendaraanLogbookDriver />;
    }
    if (currentPage === "/marketing/general/kendaraan/approval-driver") {
      return <GeneralKendaraanApprovalDriver />;
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
    // NEW Marketing General Ticket Routes
    if (currentPage === "/marketing/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
    }

    // GA Routes
    if (currentPage === "/ga/dashboard") {
      return <GAPerformanceDashboard />;
    }
    // Monitoring Pajak Kendaraan
    if (currentPage === "/ga/pajak-kendaraan/master-kendaraan") {
      return <GAKendaraanMasterDashboard />;
    }
    if (currentPage === "/ga/pajak-kendaraan/pajak-kendaraan") {
      return <GAPajakKendaraanDashboard />;
    }
    // GA Monitoring Pajak - Tambahan
    if (currentPage === "/ga/pajak/pbb") {
      return <GAPajakPBBDashboard />;
    }
    if (currentPage === "/ga/pajak/iuran-keanggotaan") {
      return <GAIuranKeanggotaanDashboard />;
    }
    // GA Master Aset
    if (currentPage === "/ga/aset/master") {
      return <GAMasterAsetDashboard />;
    }
    if (currentPage === "/ga/ba-serah-terima-asset") {
      return <GABASerahTerimaAssetDashboard />;
    }
    if (currentPage === "/ga/legalitas/monitoring") {
      return <GALegalitasPerusahaanDashboard />;
    }
    if (currentPage === "/ga/performance") {
      return <GAPerformanceDashboard />;
    }
    if (currentPage === "/ga/monitoring/sapras") {
      return <GAMonitoringSaprasDashboard />;
    }
    if (currentPage === "/ga/monitoring/kendaraan") {
      return <GAMonitoringKendaraanDashboard />;
    }
    if (currentPage === "/ga/monitoring/permintaan-driver") {
      return <GAPermintaanDriverApprovalDashboard />;
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
      return <SOTurunanDashboard role="operational" />;
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
    if (currentPage === "/procon/produksi/proses") {
      return <ProsesProduksiDashboard role="procon" />;
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
    if (currentPage === "/operational/timesheet/barang-pegawai") {
      return <TimesheetBarangPegawaiDashboard />;
    }
    if (currentPage === "/procon/timesheet/barang-pegawai") {
      return <TimesheetBarangPegawaiDashboard role="procon" />;
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
    // Operational General Kendaraan
    if (currentPage === "/operational/general/kendaraan/pengajuan-driver") {
      return <GeneralKendaraanPengajuanDriver />;
    }
    if (currentPage === "/operational/general/kendaraan/logbook-driver") {
      return <GeneralKendaraanLogbookDriver />;
    }
    if (currentPage === "/operational/general/kendaraan/approval-driver") {
      return <GeneralKendaraanApprovalDriver />;
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
    // NEW Operational General Ticket Routes
    if (currentPage === "/operational/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
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
    if (
      currentPage === "/finance/permintaan-pencairan-dana" ||
      currentPage.startsWith("/finance/permintaan-pencairan-dana?")
    ) {
      const query = currentPage.includes("?") ? currentPage.split("?")[1] : "";
      const params = new URLSearchParams(query);
      const view = params.get("view") || undefined;
      return <FinancePermintaanPencairanDanaDashboard view={view} />;
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
    if (currentPage === "/finance/tanda-terima-dokumen-pembelian") {
      return <FinanceTandaTerimaDokumenPembelianDashboard />;
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
    if (currentPage === "/finance/ap/tresuri") {
      return <FinanceAPTresuriDashboard />;
    }
    if (currentPage === "/finance/ap/laporan-hutang") {
      return <FinanceLaporanHutangDashboard />;
    }
    if (currentPage === "/finance/ap/pengajuan-dana-hutang") {
      return <FinancePengajuanDanaHutangDashboard />;
    }
    if (currentPage === "/finance/ap/pembayaran-hutang") {
      return <FinancePembayaranHutangDashboard />;
    }
    if (currentPage === "/finance/reimburse-voucher") {
      return <ReimburseVoucherDashboard />;
    }
    if (currentPage === "/finance/ar/dashboard") {
      return <ARDashboard />;
    }
    if (currentPage === "/finance/ar/invoice") {
      return <FinanceARInvoiceDashboard />;
    }
    if (currentPage === "/finance/ar/proses-pembayaran") {
      return <ProsesPembayaranARDashboard />;
    }
    if (currentPage === "/finance/ar/laporan") {
      return <FinanceLaporanARDashboard />;
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
    // Finance Voucher-Reimburse Approval Routes
    if (currentPage === "/finance/voucher-reimburse/approval-voucher") {
      return <FinanceApprovalVoucherDashboard />;
    }
    // Finance Approval Ticket Routes
    if (currentPage === "/finance/approval/ticket") {
      return <FinanceApprovalTicketDashboard />;
    }
    // Approve PI
    if (currentPage === "/finance/approve-pi") {
      return <FinanceApprovePIDashboard />;
    }

    if (currentPage === "/finance/voucher-reimburse/approval-ptj-voucher") {
      return <FinanceApprovalPTJVoucherDashboard />;
    }
    if (currentPage === "/finance/voucher-reimburse/approval-reimburse") {
      return <FinanceApprovalReimburseDashboard />;
    }
    // Finance Separate Pengajuan Routes
    if (currentPage === "/finance/pengajuan-hutang-usaha") {
      return <FinancePengajuanHutangUsahaDashboard />;
    }
    if (currentPage === "/finance/pengajuan-voucher") {
      return <FinancePengajuanVoucherDashboard />;
    }
    // Kas Bank Entry
    if (currentPage === "/finance/kas/kas-bank-entry") {
      return <FinanceKasBankEntryDashboard />;
    }
    // Laporan Kas
    if (currentPage === "/finance/kas/laporan-kas") {
      return <FinanceLaporanKasDashboard />;
    }
    // Laporan Kas Bank Harian
    if (currentPage === "/finance/kas/laporan-kas-bank-harian") {
      return <FinanceLaporanKasBankHarianDashboard />;
    }
    // Laporan Bank
    if (currentPage === "/finance/kas/laporan-bank") {
      return <FinanceLaporanBankDashboard />;
    }
    // Laporan Kas Bank Harian (Unified)
    if (currentPage === "/finance/bank/laporan-kas-bank-harian") {
      return <FinanceLaporanKasBankHarianDashboard />;
    }

    if (currentPage === "/finance/voucher/dashboard") {
      return <FinanceVoucherDashboard />;
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

    // Finance Tanda Terima Routes
    if (currentPage === "/finance/tanda-terima-dokumeni") {
      return <FinanceTandaTerimaDokumeniDashboard />;
    }
    if (currentPage === "/finance/tanda-terima-dokumen-pembelian") {
      return <FinanceTandaTerimaDokumenPembelianDashboard />;
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
      return <POBarangDashboard />;
    }
    if (currentPage === "/management/voucher-reimburse/approval-voucher") {
      return <ApprovalVoucherDashboardManajement />;
    }
    // QHSE Routes
    if (currentPage === "/qhse/dashboard") {
      return <QHSENewDashboard />;
    }
    // NEW QHSE General Ticket Routes
    if (currentPage === "/qhse/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
    }
    // Make The KPI Departemen Here
    if (currentPage === "/qhse/kpi-department/dashboard") {
      return <QHSEKPIDepartmentDashboard />;
    }
    if (currentPage === "/qhse/kpi-department/master") {
      return <QHSEMasterKPIDashboard />;
    }
    if (currentPage === "/qhse/kpi-department/list") {
      return <QHSEListKPIDashboard />;
    }

    if (currentPage === "/qhse/kompetensi-perusahaan") {
      return <QHSEKompetensiPerusahaanDashboard />;
    }

    if (currentPage === "/qhse/qhse-performance") {
      return <QHSEPerformanceDashboard />;
    }

    if (currentPage === "/qhse/monitoring-apd") {
      return <QHSEMonitoringAPDDashboard />;
    }

    if (currentPage === "/qhse/kamera-radiography") {
      return <QHSEKameraRadiographyDashboard />;
    }

    if (currentPage === "/qhse/log-book-rat") {
      return <QHSELogBookRATDashboard />;
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
    if (currentPage === "/qhse/daftar-alat-ukur") {
      return <QHSEDaftarAlatUkurDashboard />;
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
    if (currentPage === "/qhse/log-book-rat") {
      return <QHSELogBookRATDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/apd") {
      return <APDDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/mcu") {
      return <MedicalCheckUpDashboard />;
    }
    if (currentPage === "/qhse/medical-checkup-personil") {
      return <QHSEMedicalCheckUpPersonilDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personnel/nomor-report") {
      return <NomorReportDashboard />;
    }
    if (currentPage === "/qhse/monitoring-pr") {
      return <MonitoringPRDashboard />;
    }
    if (currentPage === "/qhse/monitoring-cash-advance") {
      return <MonitoringCADashboard />;
    }
    if (currentPage === "/qhse/monitoring-voucher") {
      return <MonitoringVoucherDashboard />;
    }
    if (currentPage === "/qhse/monitoring-endorse-certificate") {
      return <MonitoringEndorseCertificateDashboard />;
    }
    if (currentPage === "/qhse/monitoring-reimburse") {
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
    // New QHSE Menu Routes
    if (currentPage === "/qhse/kamera") {
      return <KameraDashboard />;
    }
    if (currentPage === "/qhse/sib-personil") {
      return <SIBPersonilDashboard />;
    }
    if (currentPage === "/qhse/dosis-card") {
      return <DosisCardDashboard />;
    }
    if (currentPage === "/qhse/radiography") {
      return <RadiographyDashboard />;
    }
    if (currentPage === "/qhse/radiography/proses-isotop") {
      return <ProsesISOTOPDashboard />;
    }
    if (currentPage === "/qhse/radiography/monitoring") {
      return <RadiographyMonitoringDashboard />;
    }
    // QHSE Components - Available
    if (currentPage === "/qhse/pengadaan") {
      return <PengadaanQHSEDashboard />;
    }
    if (currentPage === "/qhse/hydro-test") {
      return <HydroTestDashboard />;
    }
    if (currentPage === "/qhse/matrix-training") {
      return <MatrixTrainingDashboard />;
    }
    // TODO: Implement remaining QHSE components
    if (currentPage === "/qhse/pembagian-apd-record") {
      return <PembagianAPDRecordDashboard />;
    }
    if (currentPage === "/qhse/nomor-report") {
      return <NomorReportDashboard />;
    }
    if (currentPage === "/qhse/monitoring-report") {
      return <MonitoringReportDashboard />;
    }
    if (currentPage === "/qhse/daftar-induk-dokumen-internal") {
      return <QHSEDaftarIndukDokumenInternalDashboard />;
    }

    // Report
    if (currentPage === "/qhse/monitoring-personnel-report") {
      return <QHSEMonitoringPersonnelReportDashboard />;
    }
    if (currentPage === "/qhse/perundangan-k3l") {
      return <PerundanganK3LDashboard />;
    }
    if (currentPage === "/qhse/daftar-induk-dokumen-eksternal") {
      return <QHSEDaftarIndukDokumenEksternalDashboard />;
    }
    if (currentPage === "/qhse/approval-rfi/dashboard") {
      return <QHSEApprovalRFIDashboard />;
    }

    // QHSE Expired Barang Routes
    if (currentPage === "/qhse/expired-barang/ba") {
      return <QHSEExpiredBarangBADashboard />;
    }
    if (currentPage === "/qhse/expired-barang/approval") {
      return <QHSEExpiredBarangApprovalDashboard />;
    }
    if (currentPage === "/qhse/expired-barang/hasil-approved") {
      return <QHSEExpiredBarangHasilApprovedDashboard />;
    }
    if (currentPage === "/qhse/daftar-induk-rekaman-internal") {
      return <DaftarIndukRekamanInternalDashboard />;
    }
    if (currentPage === "/qhse/general/kpi/master") {
      return <QHSEMasterKPIDashboard />;
    }
    if (currentPage === "/qhse/general/kpi/list") {
      return <QHSEListKPIDashboard />;
    }
    if (currentPage === "/qhse/kompetensi-personil") {
      return <QHSEKompetensiPersonilDashboard />;
    }
    if (currentPage === "/qhse/alat-pelindung-diri") {
      return <QHSEAlatPelindungDiriDashboard />;
    }
    if (currentPage === "/qhse/log-book-tld") {
      return <QHSELogBookTLDDashboard />;
    }
    if (currentPage === "/qhse/iso-system") {
      return <ISOSystemDaftarIndukDokumenInternalDashboard />;
    }
    if (currentPage === "/qhse/general/iso-system") {
      return <QHSEGeneralISOSystemDashboard />;
    }
    if (currentPage === "/qhse/radiography/qhse/monitoring-kamera") {
      return <QHSEMonitoringKameraRadiographyDashboard />;
    }
    if (currentPage === "/qhse/radiography/qhse/uji-usap-kamera") {
      return <QHSEUjiUsapKameraDashboard />;
    }
    if (currentPage === "/qhse/radiography/qhse/kartu-dosis") {
      return <QHSEKartuDosisDashboard />;
    }
    if (currentPage === "/qhse/radiography/qhse/kartu-pemantauan-kesehatan") {
      return <QHSEKartuPemantauanKesehatanDashboard />;
    }

    // Monitoring Personil Routes
    if (currentPage === "/qhse/monitoring-personil") {
      return <QHSEMonitoringPersonilDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personil/logbook-rat") {
      return <QHSELogBookRATDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personil/logbook-tkpk") {
      return <QHSELogBookTKPKDashboard />;
    }
    if (currentPage === "/qhse/monitoring-personil/logbook-tld") {
      return <QHSELogBookTLDDashboard />;
    }

    // Additional QHSE Routes
    if (currentPage === "/qhse/daftar-alat-ukur") {
      return <QHSEDaftarAlatUkurDashboard />;
    }
    if (currentPage === "/qhse/monitoring-apd") {
      return <QHSEMonitoringAPDDashboard />;
    }
    if (currentPage === "/qhse/legalitas-perusahaan") {
      return <LegalitasPerusahaanDashboard />;
    }

    // Accounting Routes
    if (currentPage === "/accounting/dashboard") {
      return <AccountingMainDashboard />;
    }
    // NEW Accounting General Ticket Routes
    if (currentPage === "/accounting/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
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
    if (currentPage === "/accounting/asset") {
      return <AssetDashboard />;
    }
    if (currentPage === "/accounting/asset/master-kategori") {
      return <AccountingAssetMasterKategoriDashboard />;
    }
    if (currentPage === "/accounting/asset/aktivasi") {
      return <AccountingAssetAktivasiDashboard />;
    }
    if (currentPage === "/accounting/buku-besar") {
      return <BukuBesarDashboard />;
    }
    if (currentPage === "/accounting/trial-balance") {
      return <TrialBalanceDashboard />;
    }
    if (currentPage === "/accounting/posting-jurnal") {
      return <PostingJurnalDashboard />;
    }
    if (currentPage === "/accounting/jurnal-manual") {
      return <JurnalManualDashboard />;
    }
    if (currentPage === "/accounting/laporan-jurnal") {
      return <LaporanJurnalDashboard />;
    }
    if (currentPage === "/accounting/jurnal-rasio") {
      return <JurnalRasioKeuanganDashboard />;
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
    if (currentPage === "/accounting/reconcilliation/match") {
      return <ReconcilliationMatchDashboard />;
    }
    if (currentPage === "/accounting/reconcilliation/unmatch") {
      return <ReconcilliationUnmatchDashboard />;
    }

    // Tax Routes
    if (currentPage === "/tax/dashboard") {
      return <TaxDashboard />;
    }
    // NEW Tax General Ticket Routes
    if (currentPage === "/tax/general/ticket/pengajuan") {
      return <GeneralPengajuanTicketDashboard />;
    }
    if (currentPage === "/tax/pajak-masukan") {
      return <PajakMasukanDashboard />;
    }
    if (currentPage === "/tax/pajak-keluaran") {
      return <PajakKeluaranDashboard />;
    }
    if (currentPage === "/tax/pajak/laporan-rekonsiliasi-masukan") {
      return <FinancePajakRekonsiliasiMasukanDashboard />;
    }
    if (currentPage === "/tax/pajak/laporan-rekonsiliasi-keluaran") {
      return <FinancePajakRekonsiliasiKeluaranDashboard />;
    }
    if (currentPage === "/tax/pajak/proses-hutang-pajak") {
      return <FinancePajakProsesHutangDashboard />;
    }
    // Finance aliases for the same Pajak pages
    if (currentPage === "/finance/pajak/laporan-rekonsiliasi-masukan") {
      return <FinancePajakRekonsiliasiMasukanDashboard />;
    }
    if (currentPage === "/finance/pajak/laporan-rekonsiliasi-keluaran") {
      return <FinancePajakRekonsiliasiKeluaranDashboard />;
    }
    if (currentPage === "/finance/pajak/proses-hutang-pajak") {
      return <FinancePajakProsesHutangDashboard />;
    }
    if (currentPage === "/tax/pph-21") {
      return <PPh21Dashboard />;
    }
    // Accounting PPh 21 sub routes
    if (currentPage === "/tax/pph-21/karyawan") {
      return <AccountingPph21KaryawanDashboard />;
    }
    if (currentPage === "/tax/pph-21/non-karyawan") {
      return <AccountingPph21NonKaryawanDashboard />;
    }
    if (currentPage === "/tax/pph-23") {
      return <PPh23Dashboard />;
    }
    if (currentPage === "/tax/pph-4-ayat-2") {
      return <PPh4Ayat2Dashboard />;
    }
    if (currentPage === "/tax/pph-22") {
      return <PPh22Dashboard />;
    }
    if (currentPage === "/tax/pph-29") {
      return <PPh29Dashboard />;
    }
    if (currentPage === "/tax/pph-25") {
      return <PPh25Dashboard />;
    }
    if (currentPage === "/tax/tagihan/skpkb") {
      return <SKPKBDashboard />;
    }
    if (currentPage === "/tax/tagihan/sp2dk") {
      return <SP2DKDashboard />;
    }
    if (currentPage === "/tax/tagihan/stp") {
      return <STPDashboard />;
    }
    if (currentPage === "/tax/voucher-lainya/voucher") {
      return <GeneralVoucherDashboard />;
    }
    if (currentPage === "/tax/voucher-lainya/monitoring") {
      return <MonitoringVoucherDashboard />;
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
