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
import DaftarPembayaranDashboard from './DaftarPembayaranDashboard'; // New import
import DaftarVoucherDashboard from './DaftarVoucherDashboard';
import LaporanHutangUsahaDashboard from './LaporanHutangUsahaDashboard';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Clock, Target, Award } from 'lucide-react';

interface DashboardProps {
  currentPage: string;
}

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
    // Pengadaan Routes
    if (currentPage === '/pengadaan/dashboard') {
      return <PengadaanDashboard />;
    }
    if (currentPage === '/pengadaan/po/dashboard') {
      return <PODashboard />;
    }
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

    // Default to main dashboard
    return renderMainDashboard();
  };

  return renderPageContent();
};

export default Dashboard;
