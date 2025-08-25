import { MenuSection, MenuSubSection, MenuItem } from '../types';

// Helper to create the General menu section with sub-sections
const createGeneralMenu = (role: string): MenuSection => ({
  title: 'General',
  icon: 'Settings',
  subSections: [
    {
      title: 'KPI',
      icon: 'BarChart',
      items: [
        { title: 'Dashboard KPI', icon: 'LayoutDashboard', path: `/${role}/general/kpi/dashboard` },
        { title: 'Master KPI', icon: 'Database', path: `/${role}/general/kpi/master` },
        { title: 'List KPI', icon: 'List', path: `/${role}/general/kpi/list` },
      ]
    },
    {
      title: 'Voucher',
      icon: 'Ticket',
      items: [
        { title: 'Dashboard Voucher', icon: 'LayoutDashboard', path: `/${role}/general/voucher/dashboard` },
        { title: 'Proses Voucher', icon: 'Workflow', path: `/${role}/general/voucher/proses` },
      ]
    },
    {
      title: 'Reimburse',
      icon: 'Wallet',
      items: [
        { title: 'Dashboard Reimburse', icon: 'LayoutDashboard', path: `/${role}/general/reimburse/dashboard` },
        { title: 'Proses Reimburse', icon: 'FileEdit', path: `/${role}/general/reimburse/proses` },
      ]
    },
    {
      title: 'Cash Advance',
      icon: 'Banknote',
      items: [
        { title: 'Dashboard Cash Advance', icon: 'LayoutDashboard', path: `/${role}/general/cash-advance/dashboard` },
        { title: 'Proses Cash Advance', icon: 'Send', path: `/${role}/general/cash-advance/proses` },
      ]
    },
    {
      title: 'Purchase Request',
      icon: 'ShoppingCart',
      items: [
        { title: 'Dashboard Purchasing Request', icon: 'LayoutDashboard', path: `/${role}/general/purchase-request/dashboard` },
        { title: 'Proses Purchasing Request', icon: 'FilePlus', path: `/${role}/general/purchase-request/proses` },
      ]
    }
  ]
});

export const marketingMenu: MenuSection[] = [
  {
    title: 'Suspect',
    icon: 'Search',
    items: [],
    directPath: '/marketing/suspect/dashboard'
  },
  {
    title: 'Prospect',
    icon: 'Target',
    items: [],
    directPath: '/marketing/prospect/dashboard'
  },
  {
    title: 'Penawaran',
    icon: 'DollarSign',
    items: [
      { title: 'Penawaran On Call', icon: 'Phone', path: '/marketing/penawaran/on-call' },
      { title: 'Penawaran Tender', icon: 'Award', path: '/marketing/penawaran/tender' }
    ]
  },
  {
    title: 'Kontrak Deal',
    icon: 'FileCheck',
    items: [],
    directPath: '/marketing/kontrak-deal/dashboard'
  },
  {
    title: 'HPP Induk',
    icon: 'Calculator',
    items: [],
    directPath: '/marketing/hpp-induk/dashboard'
  },
  {
    title: 'Sales Order',
    icon: 'ShoppingCart',
    items: [],
    directPath: '/marketing/sales-order/dashboard'
  },
  createGeneralMenu('marketing')
];

export const operationalMenu: MenuSection[] = [
  {
    title: 'Kontrak',
    icon: 'FileSignature',
    items: [],
    directPath: '/operational/kontrak/dashboard'
  },
  {
    title: 'Sales Order',
    icon: 'ShoppingCart',
    items: [
      { title: 'SO', icon: 'List', path: '/operational/sales-order/so' },
      { title: 'SO Turunan', icon: 'GitBranch', path: '/operational/sales-order/so-turunan' }
    ]
  },
  {
    title: 'Man Power',
    icon: 'Users',
    items: [
      { title: 'Man Power', icon: 'User', path: '/operational/man-power/man-power' },
      { title: 'Man Power Plan', icon: 'Calendar', path: '/operational/man-power/plan' }
    ]
  },
  {
    title: 'HPP Turunan',
    icon: 'Calculator',
    items: [],
    directPath: '/operational/hpp-turunan/dashboard'
  },
  {
    title: 'Produksi',
    icon: 'Factory',
    items: [
      { title: 'Dashboard', icon: 'BarChart3', path: '/operational/produksi/dashboard' },
      { title: 'Proses Produksi', icon: 'Cog', path: '/operational/produksi/proses' }
    ]
  },
  {
    title: 'TimeSheet',
    icon: 'Clock',
    items: [
      { title: 'Dashboard', icon: 'BarChart3', path: '/operational/timesheet/dashboard' },
      { title: 'Timesheet Pegawai', icon: 'UserCheck', path: '/operational/timesheet/pegawai' },
      { title: 'Timesheet Barang', icon: 'Package', path: '/operational/timesheet/barang' }
    ]
  },
  {
    title: 'Training',
    icon: 'GraduationCap',
    items: [
      { title: 'Dashboard', icon: 'BarChart3', path: 'hrd/operational/training/dashboard' },
      { title: 'Proses Training', icon: 'BookOpen', path: '/operational/training/proses' }
    ]
  },
  {
    title: 'PBG',
    icon: 'Shield',
    items: [],
    directPath: '/operational/pbg/dashboard'
  },
  createGeneralMenu('operational')
];

export const hrdMenu: MenuSection[] = [
  {
    title: 'Tunjangan Unit',
    icon: 'Building',
    items: [],
    directPath: '/hrd/tunjangan-unit/dashboard'
  },
  {
    title: 'Tunjangan',
    icon: 'Gift',
    items: [],
    directPath: '/hrd/tunjangan/dashboard'
  },
  {
    title: 'Resign',
    icon: 'LogOut',
    items: [],
    directPath: '/hrd/resign/dashboard'
  },
  {
    title: 'Rekrutmen',
    icon: 'Users',
    items: [
      { title: 'List Rekrutmen', icon: 'ClipboardList', path: '/hrd/rekrutmen/dashboard' },
      { title: 'List Lamaran', icon: 'FileText', path: '/hrd/rekrutmen/list-lamaran' },
      { title: 'Kontrak Kerja', icon: 'FileCheck', path: '/hrd/rekrutmen/kontrak-kerja' },
      { title: 'History Lamaran', icon: 'History', path: '/hrd/rekrutmen/history-lamaran' }
    ]
  },
  {
    title: 'Marketing',
    icon: 'Briefcase',
    items: [],
    directPath: '/hrd/marketing/dashboard'
  },
  {
    title: 'Lembur',
    icon: 'Clock',
    items: [],
    directPath: '/hrd/lembur/dashboard'
  },
  {
    title: 'Pegawai',
    icon: 'UserRound',
    items: [
      { title: 'Daftar Pegawai', icon: 'Users', path: '/hrd/pegawai/daftar' },
      { title: 'Master UMR', icon: 'Banknote', path: '/hrd/pegawai/master-umr' }
    ]
  },
  {
    title: 'Gaji',
    icon: 'Wallet',
    items: [
      { title: 'Daftar Gaji', icon: 'FileText', path: '/hrd/gaji/daftar' },
      { title: 'Pengajian', icon: 'Calculator', path: '/hrd/gaji/pengajian' },
      { title: 'Potongan Gaji', icon: 'Scissors', path: '/hrd/gaji/potongan' },
      { title: 'History Peminjaman', icon: 'History', path: '/hrd/gaji/history-peminjaman' },
      { title: 'Daftar Peminjam Karyawan', icon: 'UsersRound', path: '/hrd/gaji/daftar-peminjam-karyawan' }
    ]
  },
  {
    title: 'Absensi',
    icon: 'CalendarCheck',
    items: [
      { title: 'Absensi Teknisi', icon: 'CalendarDays', path: '/hrd/absensi/teknisi' },
      { title: 'Approval Timesheet', icon: 'CheckCircle', path: '/hrd/absensi/approval-timesheet' }
    ]
  },
  {
    title: 'Penilaian',
    icon: 'Star',
    items: [
      { title: 'Daftar Penilaian', icon: 'ClipboardCheck', path: '/hrd/penilaian/daftar' },
      { title: 'Master KPI', icon: 'BarChart', path: '/hrd/penilaian/master-kpi' },
      { title: 'Master Indikator', icon: 'Target', path: '/hrd/penilaian/master-indikator' }
    ]
  },
  createGeneralMenu('hrd')
];

export const pengadaanMenu: MenuSection[] = [
  {
    title: 'Vendor / Supplier',
    icon: 'Factory',
    items: [
      { title: 'List Vendor', icon: 'List', path: '/pengadaan/vendor/list' },
      { title: 'Master Vendor', icon: 'FileCog', path: '/pengadaan/vendor/master' },
      { title: 'Evaluasi', icon: 'CheckCircle', path: '/pengadaan/vendor/evaluasi' },
      { title: 'Laporan', icon: 'BarChart', path: '/pengadaan/vendor/laporan' }
    ]
  },
  {
    title: 'Seleksi Supplier / Bidding',
    icon: 'Handshake',
    items: [
      { title: 'Daftar Seleksi Supplier / Bidding', icon: 'ClipboardList', path: '/pengadaan/seleksi/daftar' },
      { title: 'Proses Seleksi Supplier / Bidding', icon: 'ClipboardCheck', path: '/pengadaan/seleksi/seleksi' },
      { title: 'Laporan', icon: 'FileText', path: '/pengadaan/seleksi/laporan' }
    ]
  },
  {
    title: 'Daftar PO',
    icon: 'FileBox',
    items: [
      { title: 'Dashboard PO', icon: 'LayoutDashboard', path: '/pengadaan/po/dashboard' },
      { title: 'PO Barang', icon: 'Package', path: '/pengadaan/po/barang' },
      { title: 'PO Jasa', icon: 'Wrench', path: '/pengadaan/po/jasa' },
      { title: 'Laporan', icon: 'FileBarChart', path: '/pengadaan/po/laporan' }
    ]
  },
  {
    title: 'Penerimaan Barang',
    icon: 'Truck',
    items: [
      { title: 'Daftar Penerimaan Barang', icon: 'ListChecks', path: '/pengadaan/penerimaan/daftar' },
      { title: 'Purchasing', icon: 'ShoppingCart', path: '/pengadaan/penerimaan/purchasing' },
      { title: 'Invoice', icon: 'FileInvoice', path: '/pengadaan/penerimaan/invoice' },
      { title: 'Gudang', icon: 'Warehouse', path: '/pengadaan/penerimaan/gudang' },
      { title: 'Laporan', icon: 'BarChart2', path: '/pengadaan/penerimaan/laporan' }
    ]
  },
  createGeneralMenu('pengadaan')
];

export const financeMenu: MenuSection[] = [
  {
    title: 'Main Dashboard',
    icon: 'Home',
    items: [],
    directPath: '/finance/dashboard'
  },
  {
    title: 'Approval',
    icon: 'CheckCircle',
    items: [
      { title: 'Approval Tiket', icon: 'Ticket', path: '/finance/approval/tiket' },
      { title: 'Approval Invoice', icon: 'FileText', path: '/finance/approval/invoice' },
      { title: 'Approval Penggajian', icon: 'DollarSign', path: '/finance/approval/penggajian' },
      { title: 'Approval PO Training', icon: 'BookOpen', path: '/finance/approval/po-training' },
      { title: 'Approval Voucher', icon: 'CreditCard', path: '/finance/approval/voucher' },
    ]
  },
  {
    title: 'Voucher',
    icon: 'Wallet',
    items: [
      { title: 'Daftar Pembayaran', icon: 'ClipboardList', path: '/finance/voucher/daftar-pembayaran' },
      { title: 'Daftar Voucher', icon: 'FileInvoice', path: '/finance/voucher/daftar-voucher' },
      { title: 'Laporan Hutang Usaha', icon: 'BarChart', path: '/finance/voucher/laporan-hutang-usaha' }
    ]
  }
];

export const gudangMenu: MenuSection[] = [
  {
    title: 'Main Dashboard',
    icon: 'Home',
    items: [],
    directPath: '/gudang/dashboard'
  },
  {
    title: 'Barang',
    icon: 'Box',
    items: [
      { title: 'Master Barang', icon: 'List', path: '/gudang/barang/master' },
      { title: 'Kategori Barang', icon: 'Tag', path: '/gudang/barang/kategori' },
      { title: 'Satuan Barang', icon: 'Grid', path: '/gudang/barang/satuan' },
      { title: 'Expired Barang', icon: 'AlertTriangle', path: '/gudang/barang/expired' },
      { title: 'Restock Expired Barang', icon: 'RotateCw', path: '/gudang/barang/restock-expired' },
      { title: 'Stock Barang', icon: 'Layers', path: '/gudang/barang/stock' }
    ]
  },
  {
    title: 'Gudang Proyek',
    icon: 'Building',
    items: [],
    directPath: '/gudang/gudang-proyek/dashboard'
  },
  {
    title: 'Penerimaan Barang Masuk',
    icon: 'Download',
    items: [],
    directPath: '/gudang/penerimaan-barang-masuk/dashboard'
  },
  {
    title: 'Mutasi Barang',
    icon: 'Shuffle',
    items: [],
    directPath: '/gudang/mutasi-barang/dashboard'
  },
  {
    title: 'Pengembalian Barang',
    icon: 'RotateCcw',
    items: [
      { title: 'Pengembalian Barang', icon: 'RotateCcw', path: '/gudang/pengembalian-barang/pengembalian' },
      { title: 'Barang Karantina', icon: 'Shield', path: '/gudang/pengembalian-barang/karantina' },
      { title: 'Barang Dibuang', icon: 'Trash', path: '/gudang/pengembalian-barang/dibuang' },
      { title: 'Timesheet Barang', icon: 'Clock', path: '/gudang/pengembalian-barang/timesheet' }
    ]
  },
  {
    title: 'Stock Opname',
    icon: 'ClipboardCheck',
    items: [
      { title: 'Stock Opname', icon: 'ClipboardCheck', path: '/gudang/stock-opname/stock-opname' },
      { title: 'Verifikasi Stock Opname', icon: 'CheckCircle', path: '/gudang/stock-opname/verifikasi' },
      { title: 'Laporan Semua Stock', icon: 'FileText', path: '/gudang/stock-opname/laporan' }
    ]
  },
  {
    title: 'Monitoring Alat Proyek',
    icon: 'Monitor',
    items: [],
    directPath: '/gudang/monitoring-alat-proyek/dashboard'
  },
  {
    title: 'Permintaan Barang Gudang',
    icon: 'ShoppingCart',
    items: [],
    directPath: '/gudang/permintaan-barang-gudang/dashboard'
  },
  createGeneralMenu('gudang')
];
