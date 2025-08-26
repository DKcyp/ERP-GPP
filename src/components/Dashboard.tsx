import React from 'react';
import { useAuth } from '../context/AuthContext';
import SuspectDashboard from './SuspectDashboard';
import ProspectDashboard from './ProspectDashboard';
import PenawaranOnCallDashboard from './PenawaranOnCallDashboard';
import PenawaranTenderDashboard from './PenawaranTenderDashboard';
import KontrakDealDashboard from './KontrakDealDashboard';
import HPPIndukDashboard from './HPPIndukDashboard';
import SalesOrderDashboard from './SalesOrderDashboard';
import KontrakDashboard from './KontrakDashboard';
import OperationalSalesOrderDashboard from './OperationalSalesOrderDashboard';
import SOTurunanDashboard from './SOTurunanDashboard';
import ManPowerDashboard from './ManPowerDashboard';
import ManPowerPlanDashboard from './ManPowerPlanDashboard';
import HPPTurunanDashboard from './HPPTurunanDashboard';
import ProduksiDashboard from './ProduksiDashboard';
import ProsesProduksiDashboard from './ProsesProduksiDashboard';
import TimesheetDashboard from './TimesheetDashboard';
import TimesheetPegawaiDashboard from './TimesheetPegawaiDashboard';
import TimesheetBarangDashboard from './TimesheetBarangDashboard';
import TrainingDashboard from './TrainingDashboard';
import ProsesPengajuanTrainingDashboard from './ProsesPengajuanTrainingDashboard';
import PBGDashboard from './PBGDashboard';
import HRDDashboard from './HRDDashboard';
import ReqrutmenDashboard from './ReqrutmenDashboard';
import ListLamaranDashboard from './ListLamaranDashboard';
import KontrakKerjaDashboard from './KontrakKerjaDashboard';
import HistoryLamaranDashboard from './HistoryLamaranDashboard';
import TunjanganUnitDashboard from './TunjanganUnitDashboard';
import TunjanganDashboard from './TunjanganDashboard';
import ResignDashboard from './ResignDashboard';
import HRDMarketingDashboard from './HRDMarketingDashboard';
import LemburDashboard from './LemburDashboard';
import DaftarPegawaiDashboard from './DaftarPegawaiDashboard';
import MasterUMRDashboard from './MasterUMRDashboard';
import DaftarGajiDashboard from './DaftarGajiDashboard';
import PotonganGajiDashboard from './PotonganGajiDashboard';
import HistoryPeminjamanDashboard from './HistoryPeminjamanDashboard';
import DaftarPeminjamKaryawanDashboard from './DaftarPeminjamKaryawanDashboard';
import AbsensiTeknisiDashboard from './AbsensiTeknisiDashboard';
import ApprovalTimesheetDashboard from './ApprovalTimesheetDashboard';
import DaftarPenilaianDashboard from './DaftarPenilaianDashboard';
import PengadaanDashboard from './PengadaanDashboard';
import VendorListDashboard from './VendorListDashboard';
import MasterVendorDashboard from './MasterVendorDashboard';
import SeleksiSupplierDashboard from './SeleksiSupplierDashboard';
import POBarangDashboard from './POBarangDashboard';
import POJasaDashboard from './POJasaDashboard';
import ProsesSeleksiSupplierDashboard from './ProsesSeleksiSupplierDashboard';
import PODashboard from './PODashboard';
import DaftarPenerimaanBarangDashboard from './DaftarPenerimaanBarangDashboard';
import PurchasingDashboard from './PurchasingDashboard';
import InvoiceDashboard from './InvoiceDashboard';
import GudangDashboard from './GudangDashboard';
import DaftarSeleksiSupplierBiddingDashboard from './DaftarSeleksiSupplierBiddingDashboard';
import FinanceDashboard from './FinanceDashboard';
import ApprovalTiketDashboard from './ApprovalTiketDashboard';
import ApprovalInvoiceDashboard from './ApprovalInvoiceDashboard';
import ApprovalPenggajianDashboard from './ApprovalPenggajianDashboard';
import ApprovalPOTrainingDashboard from './ApprovalPOTrainingDashboard';
import ApprovalVoucherDashboard from './ApprovalVoucherDashboard';
import DaftarPembayaranDashboard from './DaftarPembayaranDashboard';
import DaftarVoucherDashboard from './DaftarVoucherDashboard';
import LaporanHutangUsahaDashboard from './LaporanHutangUsahaDashboard';
// Gudang Dashboards
import MasterBarangDashboard from './MasterBarangDashboard';
import KategoriBarangDashboard from './KategoriBarangDashboard';
import SatuanBarangDashboard from './SatuanBarangDashboard';
import ExpiredBarangDashboard from './ExpiredBarangDashboard';
import RestockExpiredBarangDashboard from './RestockExpiredBarangDashboard';
import StockBarangDashboard from './StockBarangDashboard';
import GudangProyekDashboard from './GudangProyekDashboard';
import PenerimaanBarangMasukDashboard from './PenerimaanBarangMasukDashboard';
import MutasiBarangDashboard from './MutasiBarangDashboard';
import PengembalianBarangDashboard from './PengembalianBarangDashboard';
import BarangKarantinaDashboard from './BarangKarantinaDashboard';
import BarangDibuangDashboard from './BarangDibuangDashboard';
import TimesheetBarangGudangDashboard from './TimesheetBarangGudangDashboard';
import StockOpnameDashboard from './StockOpnameDashboard';
import VerifikasiStockOpnameDashboard from './VerifikasiStockOpnameDashboard';
import LaporanSemuaStockDashboard from './LaporanSemuaStockDashboard';
import MonitoringAlatProyekDashboard from './MonitoringAlatProyekDashboard';
import PermintaanBarangGudangDashboard from './PermintaanBarangGudangDashboard';
import GudangMainDashboard from './GudangMainDashboard';
import DashboardKPIDashboard from './DashboardKPIDashboard'; // New import for KPI Dashboard
import GeneralMasterKPIDashboard from './GeneralMasterKPIDashboard'; // Import the new Master KPI component
import GeneralListKPIDashboard from './GeneralListKPIDashboard'; // Import the new List KPI component
import GeneralVoucherDashboard from './GeneralVoucherDashboard'; // Corrected: Import the actual GeneralVoucherDashboard
import GeneralProsesVoucherDashboard from './GeneralProsesVoucherDashboard'; // Import the new Proses Voucher component
import GeneralReimburseDashboard from './GeneralReimburseDashboard'; // Import the new GeneralReimburseDashboard
import GeneralProsesReimburseDashboard from './GeneralProsesReimburseDashboard'; // Import the new Proses Reimburse component
import GeneralCashAdvanceDashboard from './GeneralCashAdvanceDashboard'; // Import the new GeneralCashAdvanceDashboard
import GeneralProsesCashAdvance from './GeneralProsesCashAdvance'; // Import the new Proses Cash Advance component
import GeneralPurchasingRequestDashboard from './GeneralPurchasingRequestDashboard'; // Import the new GeneralPurchasingRequestDashboard
import GeneralProsesPurchasingRequest from './GeneralProsesPurchasingRequest'; // Import the new Proses Purchasing Request component
import PengajianActiveDashboard from './PengajianActiveDashboard'; // Import the new PengajianActiveDashboard

import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Target, Award, Clock, Menu } from 'lucide-react'; // Added Clock and Menu


interface DashboardProps {
  currentPage: string;
}

// Placeholder for Management Dashboard
const ManagementDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Management Main Dashboard</h1>
      <p className="text-gray-600">Welcome to the Management Dashboard. Select an option from the menu to proceed with approvals.</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ currentPage }) => {
  const { user } = useAuth();

  // Main dashboard content based on user role
  const renderMainDashboard = () => {
    if (user?.role === 'hrd') {
      return <HRDDashboard />;
    }

    if (user?.role === 'pengadaan') {
      return <PengadaanDashboard />;
    }

    if (user?.role === 'finance') {
      return <FinanceDashboard />;
    }

    if (user?.role === 'gudang') {
      return <GudangMainDashboard />; // Render GudangMainDashboard for gudang role
    }

    if (user?.role === 'management') {
      return <ManagementDashboard />; // Render ManagementDashboard for management role
    }

    // Marketing Dashboard
    if (user?.role === 'marketing') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                    MARKETING DASHBOARD
                  </h1>
                  <nav className="text-sm text-gray-600">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                    <span className="mx-2">›</span>
                    <span className="text-blue-600 font-medium">Dashboard</span>
                  </nav>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Suspects</p>
                    <p className="text-3xl font-bold text-gray-900">127</p>
                    <p className="text-sm text-green-600 font-medium">+12% dari bulan lalu</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Prospects</p>
                    <p className="text-3xl font-bold text-gray-900">89</p>
                    <p className="text-sm text-green-600 font-medium">+8% dari bulan lalu</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Penawaran</p>
                    <p className="text-3xl font-bold text-gray-900">45</p>
                    <p className="text-sm text-red-600 font-medium">-3% dari bulan lalu</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Deals Closed</p>
                    <p className="text-3xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-green-600 font-medium">+15% dari bulan lalu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Revenue Overview</h3>
              <div className="h-64 flex items-end justify-center space-x-4">
                {[
                  { month: 'Jan', value: 85, color: 'bg-blue-500' },
                  { month: 'Feb', value: 92, color: 'bg-green-500' },
                  { month: 'Mar', value: 78, color: 'bg-purple-500' },
                  { month: 'Apr', value: 95, color: 'bg-yellow-500' },
                  { month: 'May', value: 88, color: 'bg-red-500' },
                  { month: 'Jun', value: 100, color: 'bg-indigo-500' }
                ].map((item, index) => (
                  <div key={item.month} className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-12 ${item.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                      style={{ height: `${item.value * 2}px` }}
                    ></div>
                    <span className="text-sm text-gray-600 font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {[
                  { action: 'New suspect added', client: 'PT Teknologi Maju', time: '2 hours ago', type: 'success' },
                  { action: 'Penawaran submitted', client: 'CV Digital Solutions', time: '4 hours ago', type: 'info' },
                  { action: 'Deal closed', client: 'PT Industri Kreatif', time: '1 day ago', type: 'success' },
                  { action: 'Follow-up scheduled', client: 'UD Berkah Jaya', time: '2 days ago', type: 'warning' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.client}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Operational Dashboard
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  OPERATIONAL DASHBOARD
                </h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">Operational</span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">Dashboard</span>
                </nav>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900">34</p>
                  <p className="text-sm text-green-600 font-medium">+5% dari bulan lalu</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Man Power</p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-green-600 font-medium">+8% dari bulan lalu</p>
                  </div>
                </div>
              </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Production Value</p>
                  <p className="text-3xl font-bold text-gray-900">89%</p>
                  <p className="text-sm text-green-600 font-medium">+12% dari bulan lalu</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">On Schedule</p>
                  <p className="text-3xl font-bold text-gray-900">78%</p>
                  <p className="text-sm text-red-600 font-medium">-2% dari bulan lalu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Status Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Status Overview</h3>
            <div className="h-64 flex items-end justify-center space-x-4">
              {[
                { category: 'Completed', value: 75, color: 'bg-green-500' },
                { category: 'In Progress', value: 60, color: 'bg-blue-500' },
                { category: 'Planning', value: 45, color: 'bg-yellow-500' },
                { category: 'On Hold', value: 20, color: 'bg-red-500' }
              ].map((item, index) => (
                <div key={item.category} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-16 ${item.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                    style={{ height: `${item.value * 2.5}px` }}
                  ></div>
                  <span className="text-sm text-gray-600 font-medium text-center">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Operations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Operations</h3>
            <div className="space-y-4">
              {[
                { action: 'New SO created', project: 'Project Alpha', time: '1 hour ago', type: 'success' },
                { action: 'Man power assigned', project: 'Project Beta', time: '3 hours ago', type: 'info' },
                { action: 'Training completed', project: 'Safety Training', time: '5 hours ago', type: 'success' },
                { action: 'Equipment maintenance', project: 'Project Gamma', time: '1 day ago', type: 'warning' }
              ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.project}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

  // Route to specific pages based on currentPage
  const renderPageContent = () => {
    console.log('Dashboard: Current page received:', currentPage); // Added console log
    // Gudang Routes
    if (currentPage === '/gudang/dashboard') {
      return <GudangMainDashboard />; // Render GudangMainDashboard for the specific path
    }
    if (currentPage === '/gudang/barang/master') {
      return <MasterBarangDashboard />;
    }
    if (currentPage === '/gudang/barang/kategori') { // New route
      return <KategoriBarangDashboard />;
    }
    if (currentPage === '/gudang/barang/satuan') {
      return <SatuanBarangDashboard />;
    }
    if (currentPage === '/gudang/barang/expired') {
      return <ExpiredBarangDashboard />;
    }
    if (currentPage === '/gudang/barang/restock-expired') {
      return <RestockExpiredBarangDashboard />;
    }
    if (currentPage === '/gudang/barang/stock') {
      return <StockBarangDashboard />;
    }
    if (currentPage === '/gudang/gudang-proyek/dashboard') {
      return <GudangProyekDashboard />;
    }
    if (currentPage === '/gudang/penerimaan-barang-masuk/dashboard') {
      return <PenerimaanBarangMasukDashboard />;
    }
    if (currentPage === '/gudang/mutasi-barang/dashboard') {
      return <MutasiBarangDashboard />;
    }
    if (currentPage === '/gudang/pengembalian-barang/pengembalian') {
      return <PengembalianBarangDashboard />;
    }
    if (currentPage === '/gudang/pengembalian-barang/karantina') {
      return <BarangKarantinaDashboard />;
    }
    if (currentPage === '/gudang/pengembalian-barang/dibuang') {
      return <BarangDibuangDashboard />;
    }
    if (currentPage === '/gudang/pengembalian-barang/timesheet') {
      return <TimesheetBarangGudangDashboard />;
    }
    if (currentPage === '/gudang/stock-opname/stock-opname') {
      return <StockOpnameDashboard />;
    }
    if (currentPage === '/gudang/stock-opname/verifikasi') {
      return <VerifikasiStockOpnameDashboard />;
    }
    if (currentPage === '/gudang/stock-opname/laporan') {
      return <LaporanSemuaStockDashboard />;
    }
    if (currentPage === '/gudang/monitoring-alat-proyek/dashboard') {
      return <MonitoringAlatProyekDashboard />;
    }
    if (currentPage === '/gudang/permintaan-barang-gudang/dashboard') {
      return <PermintaanBarangGudangDashboard />;
    }
    // NEW General Gudang Routes
    if (currentPage === '/gudang/general/kpi/dashboard') {
      console.log('Dashboard: Rendering DashboardKPIDashboard for path:', currentPage);
      return <DashboardKPIDashboard />;
    }
    if (currentPage === '/gudang/general/kpi/master') {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === '/gudang/general/kpi/list') {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === '/gudang/general/voucher/dashboard') {
      return <GeneralVoucherDashboard />; // Corrected: Render the imported component
    }
    if (currentPage === '/gudang/general/voucher/proses') {
      return <GeneralProsesVoucherDashboard />; // Render the actual component
    }
    if (currentPage === '/gudang/general/reimburse/dashboard') {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === '/gudang/general/reimburse/proses') {
      return <GeneralProsesReimburseDashboard />; // Render the actual component
    }
    if (currentPage === '/gudang/general/cash-advance/dashboard') {
      return <GeneralCashAdvanceDashboard />; // Render the actual component
    }
    if (currentPage === '/gudang/general/cash-advance/proses') {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === '/gudang/general/purchase-request/dashboard') {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === '/gudang/general/purchase-request/proses') {
      return <GeneralProsesPurchasingRequest />;
    }


    // Pengadaan Routes
    if (currentPage === '/pengadaan/dashboard') {
      return <PengadaanDashboard />;
    }
    if (currentPage === '/pengadaan/po/dashboard') {
      return <PODashboard />;
    } {/* Corrected: Added closing brace here */}
    if (currentPage === '/pengadaan/seleksi/daftar') {
      return <SeleksiSupplierDashboard />;
    }
    if (currentPage === '/pengadaan/vendor/list') {
      return <VendorListDashboard />;
    }
    if (currentPage === '/pengadaan/vendor/master') {
      return <MasterVendorDashboard />;
    }
    if (currentPage === '/pengadaan/seleksi/seleksi') {
      return <DaftarSeleksiSupplierBiddingDashboard />; // Updated to new list view
    }
    if (currentPage === '/pengadaan/po/barang') {
      return <POBarangDashboard />;
    }
    if (currentPage === '/pengadaan/po/jasa') {
      return <POJasaDashboard />;
    }
    if (currentPage === '/pengadaan/penerimaan/daftar') {
      return <DaftarPenerimaanBarangDashboard />;
    }
    if (currentPage === '/pengadaan/penerimaan/purchasing') {
      return <PurchasingDashboard />;
    }
    if (currentPage === '/pengadaan/penerimaan/invoice') {
      return <InvoiceDashboard />;
    }
    if (currentPage === '/pengadaan/penerimaan/gudang') {
      return <GudangDashboard />;
    }
    // Pengadaan General Routes
    if (currentPage === '/pengadaan/general/kpi/dashboard') {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === '/pengadaan/general/kpi/master') {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === '/pengadaan/general/kpi/list') {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === '/pengadaan/general/voucher/dashboard') {
      return <GeneralVoucherDashboard />; // Corrected: Render the imported component
    }
    if (currentPage === '/pengadaan/general/voucher/proses') {
      return <GeneralProsesVoucherDashboard />; // Render the actual component
    }
    if (currentPage === '/pengadaan/general/reimburse/dashboard') {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === '/pengadaan/general/reimburse/proses') {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === '/pengadaan/general/cash-advance/dashboard') {
      return <GeneralCashAdvanceDashboard />; // Render the actual component
    }
    if (currentPage === '/pengadaan/general/cash-advance/proses') {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === '/pengadaan/general/purchase-request/dashboard') {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === '/pengadaan/general/purchase-request/proses') {
      return <GeneralProsesPurchasingRequest />;
    }

    // HRD Routes
    if (currentPage === '/hrd/dashboard') {
      return <HRDDashboard />;
    }
    if (currentPage === '/hrd/tunjangan-unit/dashboard') {
      return <TunjanganUnitDashboard />;
    }
    if (currentPage === '/hrd/tunjangan/dashboard') {
      return <TunjanganDashboard />;
    }
    if (currentPage === '/hrd/resign/dashboard') {
      return <ResignDashboard />;
    }
    if (currentPage === '/hrd/rekrutmen/dashboard') {
      return <ReqrutmenDashboard />;
    }
    if (currentPage === '/hrd/rekrutmen/list-lamaran') {
      return <ListLamaranDashboard />;
    }
    if (currentPage === '/hrd/rekrutmen/kontrak-kerja') {
      return <KontrakKerjaDashboard />;
    }
    if (currentPage === '/hrd/rekrutmen/history-lamaran') {
      return <HistoryLamaranDashboard />;
    }
    if (currentPage === '/hrd/marketing/dashboard') {
      return <HRDMarketingDashboard />;
    }
    if (currentPage === '/hrd/lembur/dashboard') {
      return <LemburDashboard />;
    }
    if (currentPage === '/hrd/pegawai/daftar') {
      return <DaftarPegawaiDashboard />;
    }
    if (currentPage === '/hrd/pegawai/master-umr') {
      return <MasterUMRDashboard />;
    }
    if (currentPage === '/hrd/gaji/daftar') {
      return <DaftarGajiDashboard />;
    }
    if (currentPage === '/hrd/gaji/pengajian') { // New route for PengajianActive
      return <PengajianActiveDashboard />;
    }
    if (currentPage === '/hrd/gaji/potongan') {
      return <PotonganGajiDashboard />;
    }
    if (currentPage === '/hrd/gaji/history-peminjaman') {
      return <HistoryPeminjamanDashboard />;
    }
    if (currentPage === '/hrd/gaji/daftar-peminjam-karyawan') {
      return <DaftarPeminjamKaryawanDashboard />;
    }
    if (currentPage === '/hrd/absensi/teknisi') {
      return <AbsensiTeknisiDashboard />;
    }
    if (currentPage === '/hrd/absensi/approval-timesheet') {
      return <ApprovalTimesheetDashboard />;
    }
    if (currentPage === '/hrd/penilaian/daftar') {
      return <DaftarPenilaianDashboard />;
    }
    // HRD General Routes
    if (currentPage === '/hrd/general/kpi/dashboard') {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === '/hrd/general/kpi/master') {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === '/hrd/general/kpi/list') {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === '/hrd/general/voucher/dashboard') {
      return <GeneralVoucherDashboard />; // Corrected: Render the imported component
    }
    if (currentPage === '/hrd/general/voucher/proses') {
      return <GeneralProsesVoucherDashboard />; // Render the actual component
    }
    if (currentPage === '/hrd/general/reimburse/dashboard') {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === '/hrd/general/reimburse/proses') {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === '/hrd/general/cash-advance/dashboard') {
      return <GeneralCashAdvanceDashboard />; // Render the actual component
    }
    if (currentPage === '/hrd/general/cash-advance/proses') {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === '/hrd/general/purchase-request/dashboard') {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === '/hrd/general/purchase-request/proses') {
      return <GeneralProsesPurchasingRequest />;
    }

    // Marketing Routes
    if (currentPage === '/marketing/suspect/dashboard') {
      return <SuspectDashboard />;
    }
    if (currentPage === '/marketing/prospect/dashboard') {
      return <ProspectDashboard />;
    }
    if (currentPage === '/marketing/penawaran/on-call') {
      return <PenawaranOnCallDashboard />;
    }
    if (currentPage === '/marketing/penawaran/tender') {
      return <PenawaranTenderDashboard />;
    }
    if (currentPage === '/marketing/kontrak-deal/dashboard') {
      return <KontrakDealDashboard />;
    }
    if (currentPage === '/marketing/hpp-induk/dashboard') {
      return <HPPIndukDashboard />;
    }
    if (currentPage === '/marketing/sales-order/dashboard') {
      return <SalesOrderDashboard />;
    }
    // Marketing General Routes
    if (currentPage === '/marketing/general/kpi/dashboard') {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === '/marketing/general/kpi/master') {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === '/marketing/general/kpi/list') {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === '/marketing/general/voucher/dashboard') {
      return <GeneralVoucherDashboard />; // Corrected: Render the imported component
    }
    if (currentPage === '/marketing/general/voucher/proses') {
      return <GeneralProsesVoucherDashboard />; // Render the actual component
    }
    if (currentPage === '/marketing/general/reimburse/dashboard') {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === '/marketing/general/reimburse/proses') {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === '/marketing/general/cash-advance/dashboard') {
      return <GeneralCashAdvanceDashboard />; // Render the actual component
    }
    if (currentPage === '/marketing/general/cash-advance/proses') {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === '/marketing/general/purchase-request/dashboard') {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === '/marketing/general/purchase-request/proses') {
      return <GeneralProsesPurchasingRequest />;
    }

    // Operational Routes
    if (currentPage === '/operational/kontrak/dashboard') {
      return <KontrakDashboard />;
    }
    if (currentPage === '/operational/sales-order/so') {
      return <OperationalSalesOrderDashboard />;
    }
    if (currentPage === '/operational/sales-order/so-turunan') {
      return <SOTurunanDashboard />;
    }
    if (currentPage === '/operational/man-power/man-power') {
      return <ManPowerDashboard />;
    }
    if (currentPage === '/operational/man-power/plan') {
      return <ManPowerPlanDashboard />;
    }
    if (currentPage === '/operational/hpp-turunan/dashboard') {
      return <HPPTurunanDashboard />;
    }
    if (currentPage === '/operational/produksi/dashboard') {
      return <ProduksiDashboard />;
    }
    if (currentPage === '/operational/produksi/proses') {
      return <ProsesProduksiDashboard />;
    }
    if (currentPage === '/operational/timesheet/dashboard') {
      return <TimesheetDashboard />;
    }
    if (currentPage === '/operational/timesheet/pegawai') {
      return <TimesheetPegawaiDashboard />;
    }
    if (currentPage === '/operational/timesheet/barang') {
      return <TimesheetBarangDashboard />;
    }
    if (currentPage === '/operational/training/dashboard') {
      return <TrainingDashboard />;
    }
    if (currentPage === '/operational/training/proses') {
      return <ProsesPengajuanTrainingDashboard />;
    }
    if (currentPage === '/operational/pbg/dashboard') {
      return <PBGDashboard />;
    }
    // Operational General Routes
    if (currentPage === '/operational/general/kpi/dashboard') {
      return <DashboardKPIDashboard />;
    }
    if (currentPage === '/operational/general/kpi/master') {
      return <GeneralMasterKPIDashboard />;
    }
    if (currentPage === '/operational/general/kpi/list') {
      return <GeneralListKPIDashboard />;
    }
    if (currentPage === '/operational/general/voucher/dashboard') {
      return <GeneralVoucherDashboard />; // Corrected: Render the imported component
    }
    if (currentPage === '/operational/general/voucher/proses') {
      return <GeneralProsesVoucherDashboard />; // Render the actual component
    }
    if (currentPage === '/operational/general/reimburse/dashboard') {
      return <GeneralReimburseDashboard />;
    }
    if (currentPage === '/operational/general/reimburse/proses') {
      return <GeneralProsesReimburseDashboard />;
    }
    if (currentPage === '/operational/general/cash-advance/dashboard') {
      return <GeneralCashAdvanceDashboard />; // Render the actual component
    }
    if (currentPage === '/operational/general/cash-advance/proses') {
      return <GeneralProsesCashAdvance />;
    }
    if (currentPage === '/operational/general/purchase-request/dashboard') {
      return <GeneralPurchasingRequestDashboard />;
    }
    if (currentPage === '/operational/general/purchase-request/proses') {
      return <GeneralProsesPurchasingRequest />;
    }

    // Finance Routes
    if (currentPage === '/finance/dashboard') {
      return <FinanceDashboard />;
    }
    if (currentPage === '/finance/approval/tiket') {
      return <ApprovalTiketDashboard />;
    }
    if (currentPage === '/finance/approval/invoice') {
      return <ApprovalInvoiceDashboard />;
    }
    if (currentPage === '/finance/approval/penggajian') {
      return <ApprovalPenggajianDashboard />;
    }
    if (currentPage === '/finance/approval/po-training') {
      return <ApprovalPOTrainingDashboard />;
    }
    if (currentPage === '/finance/approval/voucher') {
      return <ApprovalVoucherDashboard />;
    }
    if (currentPage === '/finance/voucher/daftar-pembayaran') { // New route
      return <DaftarPembayaranDashboard />;
    }
    if (currentPage === '/finance/voucher/daftar-voucher') {
      return <DaftarVoucherDashboard />;
    }
    if (currentPage === '/finance/voucher/laporan-hutang-usaha') {
      return <LaporanHutangUsahaDashboard />;
    }

    // Management Routes
    if (currentPage === '/management/dashboard') {
      return <ManagementDashboard />;
    }
    if (currentPage === '/management/approve-kontrak') {
      return <KontrakKerjaDashboard role="management" />; // Pass role prop
    }
    if (currentPage === '/management/penggajian') {
      return <PengajianActiveDashboard role="management" />; // Pass role prop
    }

    // Default to main dashboard
    return renderMainDashboard();
  };

  return renderPageContent();
};

export default Dashboard;
