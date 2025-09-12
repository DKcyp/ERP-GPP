import { MenuSection, MenuSubSection, MenuItem } from "../types";

// Helper to create the General menu section with sub-sections
const createGeneralMenu = (role: string): MenuSection => ({
  title: "General",
  icon: "Settings",
  subSections: [
    {
      title: "KPI",
      icon: "BarChart",
      items: [
        {
          title: "Dashboard KPI",
          icon: "LayoutDashboard",
          path: `/${role}/general/kpi/dashboard`,
        },
        {
          title: "Master KPI",
          icon: "Database",
          path: `/${role}/general/kpi/master`,
        },
        { title: "List KPI", icon: "List", path: `/${role}/general/kpi/list` },
      ],
    },
    {
      title: "Voucher",
      icon: "Ticket",
      items: [
        {
          title: "Dashboard Voucher",
          icon: "LayoutDashboard",
          path: `/${role}/general/voucher/dashboard`,
        },
        {
          title: "Proses Voucher",
          icon: "Workflow",
          path: `/${role}/general/voucher/proses`,
        },
        {
          title: "Pertanggung jawaban voucher",
          icon: "FileText",
          path: `/${role}/general/voucher/pertanggungjawaban`,
        }, // NEW: Pertanggung jawaban voucher
      ],
    },
    {
      title: "Reimburse",
      icon: "Wallet",
      items: [
        {
          title: "Dashboard Reimburse",
          icon: "LayoutDashboard",
          path: `/${role}/general/reimburse/dashboard`,
        },
        {
          title: "Proses Reimburse",
          icon: "FileEdit",
          path: `/${role}/general/reimburse/proses`,
        },
      ],
    },
    {
      title: "Cash Advance",
      icon: "Banknote",
      items: [
        {
          title: "Dashboard Cash Advance",
          icon: "LayoutDashboard",
          path: `/${role}/general/cash-advance/dashboard`,
        },
        {
          title: "Proses Cash Advance",
          icon: "Send",
          path: `/${role}/general/cash-advance/proses`,
        },
      ],
    },
    {
      title: "Man Power",
      icon: "Users",
      items: [
        {
          title: "Man Power",
          icon: "User",
          path: "/operational/man-power/man-power",
        },
        {
          title: "Man Power Plan",
          icon: "Calendar",
          path: "/operational/man-power/plan",
        },
        {
          title: "Pengajuan Pegawai Baru",
          icon: "UserPlus",
          path: "/operational/man-power/pengajuan-pegawai-baru",
        },
      ],
    },
    {
      title: "Training",
      icon: "GraduationCap",
      items: [
        {
          title: "Dashboard",
          icon: "BarChart3",
          path: "/operational/training/dashboard",
        },
        {
          title: "Proses Training",
          icon: "BarChart3",
          path: "/operational/training/proses",
        },
      ],
    },
    // Purchase Request for non-procon roles
    ...(role !== "procon"
      ? [
          {
            title: "Purchase Request",
            icon: "ShoppingCart",
            items: [
              {
                title: "Dashboard Purchasing Request",
                icon: "LayoutDashboard",
                path: `/${role}/general/purchase-request/dashboard`,
              },
              {
                title: "Proses Purchasing Request",
                icon: "FilePlus",
                path: `/${role}/general/purchase-request/proses`,
              },
            ],
          },
        ]
      : []),
    // For procon, include Purchase Request and Purchase Order inside General
    ...(role === "procon"
      ? [
          {
            title: "Purchase Request",
            icon: "ShoppingCart",
            items: [
              {
                title: "Approval Purchase Request",
                icon: "CheckCircle",
                path: "/procon/purchase-request/approval",
              },
            ],
          },
          {
            title: "Purchase Order",
            icon: "FileBox",
            items: [
              {
                title: "Approval Purchase Order",
                icon: "CheckCircle",
                path: "/procon/purchase-order/approval",
              },
            ],
          },
        ]
      : []),
    {
      title: "Absensi",
      icon: "Calendar",
      items: [
        {
          title: "Pengajuan Cuti",
          icon: "FilePlus",
          path: `/${role}/general/cuti/pengajuan`,
        },
        {
          title: "Approve Cuti",
          icon: "CheckCircle",
          path: `/${role}/general/cuti/approve`,
        },
        {
          title: "Lembur",
          icon: "Clock",
          path: "/hrd/lembur/dashboard",
        },
        {
          title: "Pengajuan Izin",
          icon: "FilePlus",
          path: "/hrd/absensi/pengajuan-izin",
        },
      ],
    },
    {
      title: "Kelola Dokumen",
      icon: "FileText",
      items: [
        {
          title: "Tracking Dokumen",
          icon: "ClipboardList",
          path: "/pengadaan/tracking/monitoring",
        },
      ],
    },
    // Procon-only: PBG submenu replaces Purchase Request
    ...(role === "procon"
      ? [
          {
            title: "PBG",
            icon: "Shield",
            items: [
              {
                title: "Mutasi Barang",
                icon: "Shuffle",
                path: `/${role}/general/pbg/mutasi-barang`,
              },
              {
                title: "Timesheet Barang",
                icon: "Clock",
                path: `/${role}/general/pbg/timesheet-barang`,
              },
              {
                title: "Permintaan Barang Gudang",
                icon: "ShoppingCart",
                path: `/${role}/general/pbg/permintaan-barang-gudang`,
              },
              {
                title: "Approval PBG",
                icon: "CheckCircle",
                path: `/${role}/general/pbg/approval`,
              },
            ],
          },
        ]
      : []),
    // GA-only: Internal Business Process
    ...(role === "ga"
      ? [
          {
            title: "Internal Business Process",
            icon: "Workflow",
            items: [
              {
                title: "Suport Operasional",
                icon: "LifeBuoy",
                path: `/${role}/ibp/suport-operasional`,
              },
              {
                title: "Maintenance Sarana & Prasarana",
                icon: "Wrench",
                path: `/${role}/ibp/maintenance-sapras`,
              },
              {
                title: "Penangan Troubleshoot Sistem Sarana Kerja",
                icon: "Bug",
                path: `/${role}/ibp/troubleshoot-sarana-kerja`,
              },
              {
                title: "Persediaan ATK",
                icon: "Package",
                path: `/${role}/ibp/persediaan-atk`,
              },
              {
                title: "Kebersihan Lingkungan Kerja",
                icon: "Leaf",
                path: `/${role}/ibp/kebersihan-lingkungan`,
              },
              {
                title: "Utility",
                icon: "Plug",
                path: `/${role}/general/utility/dashboard`,
              },
            ],
          },
        ]
      : []),
  ],
});

export const marketingMenu: MenuSection[] = [
  {
    title: "Dashboard", // NEW: Main Dashboard for Marketing
    icon: "Home",
    items: [],
    directPath: "/marketing/dashboard",
  },
  {
    title: "Suspect",
    icon: "Search",
    items: [],
    directPath: "/marketing/suspect/dashboard",
  },
  {
    title: "Prospect",
    icon: "Target",
    items: [],
    directPath: "/marketing/prospect/dashboard",
  },
  {
    title: "Penawaran",
    icon: "DollarSign",
    items: [
      {
        title: "Penawaran On Call",
        icon: "Phone",
        path: "/marketing/penawaran/on-call",
      },
      {
        title: "Penawaran Tender",
        icon: "Award",
        path: "/marketing/penawaran/tender",
      },
    ],
  },
  {
    title: "Kontrak/SPK/PO",
    icon: "FileCheck",
    items: [],
    directPath: "/marketing/kontrak-deal/dashboard",
  },
  {
    title: "HPP Induk",
    icon: "Calculator",
    items: [],
    directPath: "/marketing/hpp-induk/dashboard",
  },
  {
    title: "SO Induk",
    icon: "ShoppingCart",
    items: [],
    directPath: "/marketing/sales-order/dashboard",
  },
  {
    title: "SO Turunan",
    icon: "GitBranch",
    items: [],
    directPath: "/operational3/sales-order/so-turunan",
  },
  {
    title: "Insentif",
    icon: "Gift",
    items: [],
    directPath: "/marketing/insentif-marketing/dashboard",
  },
  {
    title: "Report",
    icon: "FileText",
    items: [],
    directPath: "/marketing/report-kontrak",
  },
  {
    title: "Monitoring",
    icon: "Monitor",
    items: [
      {
        title: "Monitoring Marketing",
        icon: "BarChart3",
        path: "/marketing/monitoring/marketing",
      },
    ],
  },
  {
    title: "CSI",
    icon: "Smile",
    items: [
      {
        title: "Master CSI",
        icon: "Database",
        path: "/marketing/csi/master",
      },
    ],
  },
  {
    title: "Master",
    icon: "Database",
    items: [
      {
        title: "Master Data Customer",
        icon: "Users",
        path: "/marketing/master/master-data-customer",
      },
    ],
  },
  createGeneralMenu("marketing"),
];

// GA Menu
export const gaMenu: MenuSection[] = [
  {
    title: "Dashboard",
    icon: "Home",
    items: [],
    directPath: "/ga/dashboard",
  },
  {
    title: "Monitoring Pajak Kendaraan",
    icon: "Car",
    subSections: [
      {
        title: "Pajak Kendaraan",
        icon: "Receipt",
        items: [
          {
            title: "Master Kendaraan",
            icon: "Car",
            path: "/ga/pajak-kendaraan/master-kendaraan",
          },
          {
            title: "Pajak Kendaraan",
            icon: "Receipt",
            path: "/ga/pajak-kendaraan/pajak-kendaraan",
          },
        ],
      },
    ],
  },
  {
    title: "Kompetensi Perusahaan",
    icon: "ShieldCheck",
    items: [],
    directPath: "/ga/legalitas/monitoring",
  },
  {
    title: "GA Performance",
    icon: "Gauge",
    items: [],
    directPath: "/ga/performance",
  },
  {
    title: "Monitoring Sarana dan Prasarana",
    icon: "Building2",
    items: [],
    directPath: "/ga/monitoring/sapras",
  },
  {
    title: "Monitoring",
    icon: "Monitor",
    items: [
      {
        title: "Monitoring Purchase Request (PR)",
        icon: "ShoppingCart",
        path: "/qhse/monitoring/pr",
      },
      {
        title: "Monitoring Cash Advance (CA)",
        icon: "Banknote",
        path: "/hrd/general/cash-advance/dashboard",
      },
      {
        title: "Monitoring Voucher",
        icon: "Ticket",
        path: "/qhse/monitoring/voucher",
      },
      {
        title: "Monitoring Service Kendaraan",
        icon: "Wrench",
        path: "/ga/monitoring/service-kendaraan",
      },
      {
        title: "Monitoring Maintenance Sarana & Prasarana",
        icon: "Wrench",
        path: "/ga/monitoring/maintenance-sapras",
      },
      {
        title: "Monitoring Utility",
        icon: "Plug",
        path: "/ga/monitoring/utility",
      },
    ],
  },
  {
    title: "Monitoring ATK",
    icon: "Package",
    items: [
      {
        title: "Monitoring Stok ATK",
        icon: "Package",
        path: "/ga/atk/monitoring-stok",
      },
      {
        title: "Pengajuan ATK dari User",
        icon: "FilePlus",
        path: "/ga/atk/pengajuan",
      },
    ],
  },
  {
    title: "Monitoring IT",
    icon: "Server",
    items: [
      {
        title: "Backup Data Setiap User",
        icon: "DatabaseBackup",
        path: "/ga/it/backup",
      },
      { title: "Trouble Shoot", icon: "Bug", path: "/ga/it/troubleshoot" },
      {
        title: "Maintenance Perangkat Device",
        icon: "Cpu",
        path: "/ga/it/maintenance-device",
      },
      {
        title: "Monitoring Server",
        icon: "Server",
        path: "/ga/it/monitoring-server",
      },
    ],
  },
  createGeneralMenu("ga"),
];

export const operationalMenu: MenuSection[] = [
  {
    title: "Dashboard", // NEW: Main Dashboard for Operational
    icon: "Home",
    items: [],
    directPath: "/operational/dashboard",
  },
  {
    title: "Kontrak",
    icon: "FileSignature",
    items: [],
    directPath: "/operational/kontrak/dashboard",
  },
  {
    title: "Sales Order",
    icon: "ShoppingCart",
    items: [
      { title: "SO", icon: "List", path: "/operational/sales-order/so" },
      {
        title: "Request SO Turunan",
        icon: "GitBranch",
        path: "/operational/sales-order/so-turunan",
      },
      {
        title: "SO Turunan",
        icon: "GitBranch",
        path: "/operational2/sales-order/so-turunan",
      },
    ],
  },
  // {
  //   title: "Man Power",
  //   icon: "Users",
  //   items: [
  //     {
  //       title: "Man Power",
  //       icon: "User",
  //       path: "/operational/man-power/man-power",
  //     },
  //     {
  //       title: "Man Power Plan",
  //       icon: "Calendar",
  //       path: "/operational/man-power/plan",
  //     },
  //   ],
  // },
  // {
  //   title: "HPP",
  //   icon: "Calculator",
  //   items: [],
  //   directPath: "/operational/hpp-turunan/dashboard",
  // },
  {
    title: "TimeSheet",
    icon: "Clock",
    items: [],
    directPath: "/operational/timesheet/barang-pegawai",
  },
  {
    title: "Produksi",
    icon: "Factory",
    items: [],
    directPath: "/operational/produksi/proses",
  },
  // {
  //   title: "PBG",
  //   icon: "Shield",
  //   items: [],
  //   directPath: "/operational/pbg/dashboard",
  // },
  {
    title: "Nomor Report",
    icon: "FileText",
    items: [],
    directPath: "/qhse/monitoring-personnel/nomor-report",
  },
  createGeneralMenu("operational"),
];

export const hrdMenu: MenuSection[] = [
  {
    title: "Dashboard",
    icon: "Home",
    items: [],
    directPath: "/hrd/dashboard",
  },
  {
    title: "Tunjangan",
    icon: "Gift",
    items: [
      {
        title: "Tunjangan",
        icon: "Gift",
        path: "/hrd/tunjangan/dashboard",
      },
      {
        title: "Tunjangan Unit",
        icon: "Building",
        path: "/hrd/tunjangan-unit/dashboard",
      },
    ],
  },
  {
    title: "Rekrutmen",
    icon: "Users",
    items: [
      {
        title: "List Rekrutmen",
        icon: "ClipboardList",
        path: "/hrd/rekrutmen/dashboard",
      },
      {
        title: "Talent Pool",
        icon: "FileText",
        path: "/hrd/rekrutmen/list-lamaran",
      },
      {
        title: "Kontrak Kerja",
        icon: "FileCheck",
        path: "/hrd/rekrutmen/kontrak-kerja",
      },
      {
        title: "History Lamaran",
        icon: "History",
        path: "/hrd/rekrutmen/history-lamaran",
      },
      {
        title: "REQ Man Power",
        icon: "Users",
        path: "/hrd/rekrutmen/req-man-power",
      },
      {
        title: "Master Kualifikasi",
        icon: "Database",
        path: "/hrd/rekrutmen/master-kualifikasi",
      },
    ],
  },
  {
    title: "Allowance",
    icon: "Wallet",
    items: [
      {
        title: "Perjalanan Dinas",
        icon: "Plane",
        path: "/hrd/allowance/perjalanan-dinas",
      },
      {
        title: "Lembur",
        icon: "Clock",
        path: "/hrd/lembur/dashboard",
      },
    ],
  },

  {
    title: "Pegawai",
    icon: "UserRound",
    items: [
      {
        title: "Daftar Pegawai",
        icon: "Users",
        path: "/hrd/pegawai/daftar",
      },
      // {
      //   title: "Kontrak Pegawai",
      //   icon: "FileSignature",
      //   path: "/hrd/pegawai/kontrak-pegawai",
      // },
      // {
      //   title: "Monitoring Kontrak Pegawai",
      //   icon: "ClipboardCheck",
      //   path: "/hrd/pegawai/monitoring-kontrak",
      // },
      {
        title: "Daftar Cuti Pegawai",
        icon: "Calendar",
        path: "/hrd/pegawai/list-cuti",
      },
      {
        title: "Resign",
        icon: "LogOut",
        path: "/hrd/resign/dashboard",
      },
      // {
      //   title: "Master UMR",
      //   icon: "Banknote",
      //   path: "/hrd/pegawai/master-umr",
      // },
      // {
      //   title: "Approve PR Training",
      //   icon: "GraduationCap",
      //   path: "/hrd/pegawai/pr-training",
      // },
    ],
  },
  {
    title: "Training",
    icon: "GraduationCap",
    items: [
      {
        title: "List Training",
        icon: "List",
        path: "/hrd/training/list",
      },
      {
        title: "Training Need Analysis (TNA)",
        icon: "ClipboardList",
        path: "/hrd/training/tna",
      },
      {
        title: "Matrix Training",
        icon: "Grid",
        path: "/qhse/monitoring-personnel/training-matrix",
      },
      {
        title: "PR Training",
        icon: "ShoppingCart",
        path: "/hrd/pegawai/pr-training",
      },
    ],
  },
  {
    title: "Gaji",
    icon: "Wallet",
    items: [
      {
        title: "Potongan Lain-lain",
        icon: "Scissors",
        path: "/hrd/gaji/potongan-lain",
      },
      { title: "Daftar Gaji", icon: "FileText", path: "/hrd/gaji/daftar" },
      {
        title: "Earning/Income",
        icon: "Calculator",
        path: "/hrd/gaji/pengajian",
      },
      {
        title: "Deduct/Pengurangan",
        icon: "Scissors",
        path: "/hrd/gaji/potongan",
      },
      {
        title: "Pendebetan",
        icon: "MinusCircle",
        path: "/hrd/gaji/pendebetan",
      },
      {
        title: "Payslip",
        icon: "FileSignature",
        path: "/hrd/gaji/payslip",
      },
      // {
      //   title: "History Peminjaman",
      //   icon: "History",
      //   path: "/hrd/gaji/history-peminjaman",
      // },
      {
        title: "Pinjaman Karyawan",
        icon: "UsersRound",
        path: "/hrd/gaji/daftar-peminjam-karyawan",
      },
      {
        title: "Master Income",
        icon: "FileSignature",
        path: "/hrd/gaji/master-income",
      },
      {
        title: "Master Deduct",
        icon: "FileSignature",
        path: "/hrd/gaji/master-deduct",
      },
    ],
  },
  {
    title: "Absensi",
    icon: "CalendarCheck",
    items: [
      {
        title: "Absensi",
        icon: "CalendarDays",
        path: "/hrd/absensi/teknisi",
      },
      {
        title: "Approval Timesheet",
        icon: "CheckCircle",
        path: "/hrd/absensi/approval-timesheet",
      },
      {
        title: "Kalender",
        icon: "Calendar",
        path: "/hrd/absensi/kalender",
      },
      {
        title: "Pengajuan Izin",
        icon: "FilePlus",
        path: "/hrd/absensi/pengajuan-izin",
      },
      {
        title: "Master Izin",
        icon: "FileCog",
        path: "/hrd/absensi/master-izin",
      },
    ],
  },
  {
    title: "Penilaian",
    icon: "Star",
    items: [
      {
        title: "Daftar Penilaian",
        icon: "ClipboardCheck",
        path: "/hrd/penilaian/daftar",
      },
      {
        title: "Master KPI HRD",
        icon: "BarChart",
        path: "/hrd/penilaian/master-kpi-hrd",
      },
      {
        title: "Master Indikator HRD",
        icon: "Target",
        path: "/hrd/penilaian/master-indikator-hrd",
      },
      {
        title: "SP",
        icon: "FileText",
        path: "/hrd/penilaian/sp",
      },
    ],
  },
  {
    title: "Perjanjian Kerjasama",
    icon: "Handshake",
    items: [
      {
        title: "Perjanjian Ikatan Dinas",
        icon: "FileSignature",
        path: "/hrd/perjanjian/perjanjian-ikatan-dinas",
      },
      {
        title: "Surat Izin Bekerja",
        icon: "FileText",
        path: "/hrd/perjanjian/surat-izin-bekerja",
      },
      {
        title: "No. Surat",
        icon: "FileText",
        path: "/hrd/perjanjian/no-surat",
      },
    ],
  },
  // {
  //   title: "SPK", // Moved SPK Section to HRD
  //   icon: "FileSignature",
  //   items: [
  //     { title: "Approve SPK", icon: "CheckCircle", path: "/hrd/spk/approve" },
  //   ],
  // },
  // {
  //   title: "Monitoring", // Moved SPK Section to HRD
  //   icon: "Monitor",
  //   items: [
  //     {
  //       title: "Monitoring",
  //       icon: "Monitor",
  //       path: "/qhse/monitoring/endorse-certificate",
  //     },
  //   ],
  // },
  createGeneralMenu("hrd"),
];

export const pengadaanMenu: MenuSection[] = [
  {
    title: "Dashboard",
    icon: "Home",
    items: [],
    directPath: "/pengadaan/dashboard",
  },
  {
    title: "Vendor / Supplier",
    icon: "Factory",
    items: [
      // { title: "List Vendor", icon: "List", path: "/pengadaan/vendor/list" },
      {
        title: "Master Vendor",
        icon: "FileCog",
        path: "/pengadaan/vendor/master",
      },
      {
        title: "Evaluasi Vendor",
        icon: "CheckCircle",
        path: "/pengadaan/vendor/evaluasi",
      }, // NEW: Evaluasi Vendor sub-menu
      {
        title: "Laporan Evaluasi",
        icon: "BarChart",
        path: "/pengadaan/vendor/laporan",
      },
    ],
  },
  {
    title: "Seleksi Supplier / Bidding",
    icon: "Handshake",
    items: [
      {
        title: "Dashboard Seleksi Supplier / Bidding",
        icon: "ClipboardCheck",
        path: "/pengadaan/seleksi/seleksi",
      },
      {
        title: "Daftar Seleksi Supplier / Bidding",
        icon: "ClipboardList",
        path: "/pengadaan/seleksi/daftar",
      },
      {
        title: "Laporan",
        icon: "FileText",
        path: "/pengadaan/seleksi/laporan",
      },
    ],
  },
  {
    title: "Daftar PO",
    icon: "FileBox",
    items: [
      {
        title: "Dashboard PO",
        icon: "LayoutDashboard",
        path: "/pengadaan/po/dashboard",
      },
      { title: "PO Barang", icon: "Package", path: "/pengadaan/po/barang" },
      { title: "PO Jasa", icon: "Wrench", path: "/pengadaan/po/jasa" },
      { title: "Laporan", icon: "FileBarChart", path: "/pengadaan/po/laporan" },
    ],
  },
  {
    title: "Penerimaan Barang",
    icon: "Truck",
    items: [
      {
        title: "Daftar Penerimaan Barang",
        icon: "ListChecks",
        path: "/pengadaan/penerimaan/daftar",
      },
      {
        title: "Purchasing",
        icon: "ShoppingCart",
        path: "/pengadaan/penerimaan/purchasing",
      },
      {
        title: "Gudang",
        icon: "Warehouse",
        path: "/pengadaan/penerimaan/gudang",
      }, // NEW: Gudang sub-menu
      {
        title: "Invoice",
        icon: "FileInvoice",
        path: "/pengadaan/penerimaan/invoice",
      },
      {
        title: "Laporan",
        icon: "BarChart2",
        path: "/pengadaan/penerimaan/laporan",
      },
    ],
  },
  {
    title: "Tracking Dokumen",
    icon: "ClipboardList",
    items: [],
    directPath: "/pengadaan/tracking/monitoring",
  },
  createGeneralMenu("pengadaan"),
];

export const financeMenu: MenuSection[] = [
  {
    title: "Dashboard",
    icon: "Home",
    items: [],
    directPath: "/finance/dashboard",
  },
  {
    title: "Kas",
    icon: "Banknote",
    items: [
      {
        title: "Bukti Kas Masuk",
        icon: "Download",
        path: "/finance/kas/bukti-kas-masuk",
      },
      {
        title: "Bukti Kas Keluar",
        icon: "Upload",
        path: "/finance/kas/bukti-kas-keluar",
      },
      {
        title: "Laporan Kas Kecil",
        icon: "FileText",
        path: "/finance/kas/laporan-kas-kecil",
      },
      {
        title: "Laporan Outstanding Cash Advance",
        icon: "FileText",
        path: "/finance/kas/laporan-outstanding-cash-advance",
      },
    ],
  },
  {
    title: "Kelola Bank",
    icon: "Banknote",
    items: [
      {
        title: "Laporan Bank Harian",
        icon: "FileText",
        path: "/finance/bank/laporan-bank-harian",
      },
      {
        title: "Laporan Bank Harian Khusus",
        icon: "FileText",
        path: "/finance/bank/laporan-bank-harian-khusus",
      },
    ],
  },
  {
    title: "Bank",
    icon: "Banknote",
    items: [
      {
        title: "Bukti Bank Masuk",
        icon: "Download",
        path: "/finance/bank/bukti-bank-masuk",
      },
      {
        title: "Bukti Bank Keluar",
        icon: "Upload",
        path: "/finance/bank/bukti-bank-keluar",
      },
    ],
  },
  {
    title: "AP",
    icon: "CreditCard", // Icon for Accounts Payable
    subSections: [
      {
        title: "AP Management",
        icon: "ClipboardList",
        items: [
          {
            title: "Dashboard AP",
            icon: "LayoutDashboard",
            path: "/finance/ap/dashboard",
          },
          {
            title: "Laporan Outstanding Hutang",
            icon: "FileText",
            path: "/finance/ap/laporan-outstanding-hutang",
          },
          {
            title: "Laporan Pembayaran Hutang",
            icon: "FileText",
            path: "/finance/ap/laporan-pembayaran-hutang",
          },
        ],
      },
      {
        title: "AP Transaksi",
        icon: "Folder",
        items: [
          { title: "Tresuri", icon: "FolderUp", path: "/finance/ap/tresuri" },
          {
            title: "Laporan Hutang",
            icon: "FileText",
            path: "/finance/ap/laporan-hutang",
          },
          {
            title: "Pengajuan Dana Hutang",
            icon: "Send",
            path: "/finance/ap/pengajuan-dana-hutang",
          },
          {
            title: "Pembayaran Hutang",
            icon: "Wallet",
            path: "/finance/ap/pembayaran-hutang",
          },
        ],
      },
    ],
  },
  {
    title: "Permintaan Pencairan Dana",
    icon: "Wallet",
    items: [
      // {
      //   title: "Permintaan Pencairan Dana",
      //   icon: "Wallet",
      //   path: "/finance/permintaan-pencairan-dana",
      // },
      {
        title: "List Pengajuan Hutang Usaha",
        icon: "ClipboardList",
        path: "/finance/permintaan-pencairan-dana?view=list-hutang",
      },
      {
        title: "Pengajuan Dana Voucher",
        icon: "Ticket",
        path: "/finance/permintaan-pencairan-dana?view=pengajuan-voucher",
      },
    ],
  },
  {
    title: "AR",
    icon: "ReceiptText", // Icon for Accounts Receivable
    subSections: [
      {
        title: "AR Management",
        icon: "ClipboardCheck",
        items: [
          {
            title: "Dashboard AR",
            icon: "LayoutDashboard",
            path: "/finance/ar/dashboard",
          },
          {
            title: "Invoice",
            icon: "FileInvoice",
            path: "/finance/ar/invoice",
          },
          {
            title: "Proses Pembayaran AR",
            icon: "Handshake",
            path: "/finance/ar/proses-pembayaran",
          },
          {
            title: "Laporan AR",
            icon: "FileBarChart",
            path: "/finance/ar/laporan",
          },
        ],
      },
    ],
  },
  // {
  //   title: "Collection",
  //   icon: "Wallet",
  //   items: [
  //     {
  //       title: "DashBoard SO",
  //       icon: "LayoutDashboard",
  //       path: "/finance/collection/dashboard-so",
  //     },
  //     {
  //       title: "DashBoard Proforma Invoice",
  //       icon: "FileSignature",
  //       path: "/finance/collection/dashboard-proforma-invoice",
  //     },
  //     {
  //       title: "DashBoard Invoice",
  //       icon: "FileText",
  //       path: "/finance/collection/dashboard-invoice",
  //     },
  //     {
  //       title: "DashBoard Invoice Outstanding",
  //       icon: "FileBarChart",
  //       path: "/finance/collection/dashboard-invoice-outstanding",
  //     },
  //     {
  //       title: "DashBoard Cash in",
  //       icon: "Banknote",
  //       path: "/finance/collection/dashboard-cash-in",
  //     },
  //     {
  //       title: "Database Customer",
  //       icon: "Database",
  //       path: "/finance/collection/database-customer",
  //     },
  //   ],
  // },
  // {
  //   title: "Approval",
  //   icon: "CheckCircle",
  //   items: [
  //     {
  //       title: "Approval Tiket",
  //       icon: "TicketCheck",
  //       path: "/finance/approval/tiket",
  //     },
  //     {
  //       title: "Approval Invoice",
  //       icon: "FileCheck",
  //       path: "/finance/approval/invoice",
  //     },
  //     {
  //       title: "Approval Penggajian",
  //       icon: "Wallet",
  //       path: "/finance/approval/penggajian",
  //     },
  //     {
  //       title: "Approval PO Training",
  //       icon: "Award",
  //       path: "/finance/approval/po-training",
  //     },
  //     {
  //       title: "Approval Voucher",
  //       icon: "Ticket",
  //       path: "/finance/approval/voucher",
  //     },
  //   ],
  // },
  {
    title: "Voucher",
    icon: "Ticket",
    items: [
      {
        title: "Dashboard Voucher",
        icon: "LayoutDashboard",
        path: "/finance/voucher/dashboard",
      },
      // {
      //   title: "Daftar Pembayaran",
      //   icon: "CreditCard",
      //   path: "/finance/voucher/daftar-pembayaran",
      // },
      // {
      //   title: "Daftar Voucher",
      //   icon: "TicketPercent",
      //   path: "/finance/voucher/daftar-voucher",
      // },
      // {
      //   title: "Laporan Hutang Usaha",
      //   icon: "FileText",
      //   path: "/finance/voucher/laporan-hutang-usaha",
      // },
    ],
  },
  {
    title: "Reimburse / Voucher",
    icon: "Wallet", // Icon for Reimburse / Voucher
    items: [],
    directPath: "/finance/reimburse-voucher",
  },
  {
    title: "Tanda Terima Dokumeni",
    icon: "FileText",
    items: [],
    directPath: "/finance/tanda-terima-dokumeni",
  },
  {
    title: "Tandaterima Dokumen Pembelian",
    icon: "FileText",
    items: [],
    directPath: "/finance/tanda-terima-dokumen-pembelian",
  },
];

export const gudangMenu: MenuSection[] = [
  {
    title: "Dashboard",
    icon: "Home",
    items: [],
    directPath: "/gudang/dashboard",
  },
  {
    title: "Barang",
    icon: "Box",
    items: [
      { title: "Master Barang", icon: "List", path: "/gudang/barang/master" },
      {
        title: "Kategori Barang",
        icon: "Tag",
        path: "/gudang/barang/kategori",
      },
      { title: "Satuan Barang", icon: "Grid", path: "/gudang/barang/satuan" },
      {
        title: "Expired Barang",
        icon: "AlertTriangle",
        path: "/gudang/barang/expired",
      },
      {
        title: "Restock Expired Barang",
        icon: "RotateCw",
        path: "/gudang/barang/restock-expired",
      },
      { title: "Stock Barang", icon: "Layers", path: "/gudang/barang/stock" },
    ],
  },
  {
    title: "Gudang Proyek",
    icon: "Building",
    items: [],
    directPath: "/gudang/gudang-proyek/dashboard",
  },
  {
    title: "Penerimaan Barang Masuk",
    icon: "Download",
    items: [],
    directPath: "/gudang/penerimaan-barang-masuk/dashboard",
  },
  {
    title: "Mutasi Barang",
    icon: "Shuffle",
    items: [],
    directPath: "/gudang/mutasi-barang/dashboard",
  },
  {
    title: "Pengembalian Barang",
    icon: "RotateCcw",
    items: [
      {
        title: "Pengembalian Barang",
        icon: "RotateCcw",
        path: "/gudang/pengembalian-barang/pengembalian",
      },
      {
        title: "Barang Karantina",
        icon: "Shield",
        path: "/gudang/pengembalian-barang/karantina",
      },
      {
        title: "Barang Dibuang",
        icon: "Trash",
        path: "/gudang/pengembalian-barang/dibuang",
      },
      {
        title: "Timesheet Barang",
        icon: "Clock",
        path: "/gudang/pengembalian-barang/timesheet",
      },
    ],
  },
  {
    title: "Stock Opname",
    icon: "ClipboardCheck",
    items: [
      {
        title: "Stock Opname",
        icon: "ClipboardCheck",
        path: "/gudang/stock-opname/stock-opname",
      },
      {
        title: "Verifikasi Stock Opname",
        icon: "CheckCircle",
        path: "/gudang/stock-opname/verifikasi",
      },
      {
        title: "Laporan Semua Stock",
        icon: "FileText",
        path: "/gudang/stock-opname/laporan",
      },
    ],
  },
  {
    title: "Monitoring Alat Proyek",
    icon: "Monitor",
    items: [],
    directPath: "/gudang/monitoring-alat-proyek/dashboard",
  },
  {
    title: "Permintaan Barang Gudang",
    icon: "ShoppingCart",
    items: [],
    directPath: "/gudang/permintaan-barang-gudang/dashboard",
  },
  // Grouped 'Izin Alat' menu
  {
    title: "Izin Alat", // Parent menu title
    icon: "Tool", // Parent menu icon
    subSections: [
      {
        title: "Manajemen Izin Alat", // Sub-section title
        icon: "Tool", // Sub-section icon
        items: [
          // { title: 'Monitoring Izin Alat', icon: 'Tool', path: '/gudang/monitoring-izin-alat' },
          {
            title: "Perizinan Alat",
            icon: "FileText",
            path: "/gudang/perizinan-alat",
          },
          {
            title: "Monitoring Perizinan",
            icon: "ClipboardCheck",
            path: "/gudang/monitoring-perizinan",
          },
        ],
      },
    ],
  },
  createGeneralMenu("gudang"),
];

export const managementMenu: MenuSection[] = [
  {
    title: "Main Dashboard",
    icon: "Home",
    subSections: [
      // Changed to subSections as requested
      {
        title: "Dashboards by Role",
        icon: "LayoutDashboard",
        items: [
          {
            title: "Management Dashboard",
            icon: "Briefcase",
            path: "/management/dashboard",
          },
          {
            title: "Procon Dashboard",
            icon: "HardHat",
            path: "/procon/dashboard",
          },
          {
            title: "Accounting Dashboard",
            icon: "Calculator",
            path: "/accounting/dashboard",
          },
          {
            title: "QHSE Dashboard",
            icon: "ShieldCheck",
            path: "/qhse/dashboard",
          },
          {
            title: "Gudang Dashboard",
            icon: "Warehouse",
            path: "/gudang/dashboard",
          },
          {
            title: "Finance Dashboard",
            icon: "DollarSign",
            path: "/finance/dashboard",
          },
          {
            title: "Pengadaan Dashboard",
            icon: "ShoppingCart",
            path: "/pengadaan/dashboard",
          },
          { title: "HRD Dashboard", icon: "Users", path: "/hrd/dashboard" },
          {
            title: "Operational Dashboard",
            icon: "Settings",
            path: "/operational/dashboard",
          },
          {
            title: "Marketing Dashboard",
            icon: "Megaphone",
            path: "/marketing/dashboard",
          },
        ],
      },
    ],
  },
  {
    title: "Management Monitoring Marketing",
    icon: "Monitor",
    items: [],
    directPath: "/management/monitoring/marketing",
  },
  {
    title: "Approve Kontrak",
    icon: "FileSignature", // Using FileSignature for contract approval
    items: [],
    directPath: "/management/approve-kontrak",
  },
  {
    title: "Approve gaji",
    icon: "Wallet", // Using Wallet for payroll
    items: [],
    directPath: "/management/penggajian",
  },
  {
    title: "Approval Training", // New menu item
    icon: "CheckCircle", // Icon for approval
    items: [],
    directPath: "/management/training", // Path to Proses Training page
  },
  {
    title: "Approve SPK",
    icon: "CheckCircle",
    items: [],
    directPath: "/hrd/spk/approve",
  },
  {
    title: "Approve PO Barang",
    icon: "Package",
    items: [],
    directPath: "/management/po/barang",
  },
  {
    title: "Approve PO Jasa",
    icon: "Wrench",
    items: [],
    directPath: "/management/po/jasa",
  },
];

export const qhseMenu: MenuSection[] = [
  {
    title: "Main Dashboard",
    icon: "Home",
    items: [],
    directPath: "/qhse/dashboard",
  },
  // {
  //   title: "Perizinan Alat",
  //   icon: "Tool",
  //   items: [],
  //   directPath: "/qhse/perizinan-alat",
  // },
  {
    title: "Kompetensi Perusahaan",
    icon: "ShieldCheck",
    items: [],
    directPath: "/qhse/legalitas-perusahaan",
  },
  {
    title: "QHSE Performance",
    icon: "BarChart3",
    items: [],
    directPath: "/qhse/performance",
  },
  {
    title: "RADIOGRAPHY",
    icon: "Camera",
    subSections: [
      {
        title: "Radiography",
        icon: "Camera",
        items: [
          {
            title: "Monitoring Kamera Radiography",
            icon: "Camera",
            path: "/qhse/radiography/monitoring-kamera-radiography",
          },
          {
            title: "Proses Isotop",
            icon: "UserCheck",
            path: "/qhse/radiography/sib-personnel-radiasi",
          },

          {
            title: "ThermoLuminescent Dosimeter (TLD) Badge",
            icon: "Tag",
            path: "/qhse/radiography/tld-badge",
          },
          {
            title: "Uji Usap Kamera",
            icon: "ClipboardCheck",
            path: "/qhse/radiography/uji-usap-kamera",
          },
        ],
      },
    ],
  },
  // {
  //   title: "Monitoring MCU",
  //   icon: "HeartPulse",
  //   items: [],
  //   directPath: "/qhse/monitoring-mcu",
  // },
  {
    title: "Monitoring Daftar Alat Ukur",
    icon: "ListChecks",
    items: [],
    directPath: "/qhse/monitoring-daftar-alat-ukur",
  },
  // {
  //   title: "KPI",
  //   icon: "BarChart",
  //   items: [
  //     {
  //       title: "Master KPI",
  //       icon: "Database",
  //       path: "/qhse/general/kpi/master",
  //     },
  //     { title: "List KPI", icon: "List", path: "/qhse/general/kpi/list" },
  //   ],
  // },
  {
    title: "Monitoring Personnel",
    icon: "Users",
    subSections: [
      {
        title: "Monitoring Personnel",
        icon: "Users",
        items: [
          {
            title: "Training Matrix (Technical and QHSE)",
            icon: "GraduationCap",
            path: "/qhse/monitoring-personnel/training-matrix",
          },
          {
            title: "Medical Check Up (MCU)",
            icon: "HeartPulse",
            path: "/qhse/monitoring-personnel/mcu",
          },
          {
            title: "Alat Pelindung Diri (APD)",
            icon: "Shield",
            path: "/qhse/monitoring-personnel/apd",
          },
          {
            title: "Nomor Report",
            icon: "FileText",
            path: "/qhse/monitoring-personnel/nomor-report",
          },
        ],
      },
    ],
  },
  {
    title: "Monitoring",
    icon: "Monitor",
    items: [
      {
        title: "Monitoring Purchase Request (PR)",
        icon: "ShoppingCart",
        path: "/qhse/monitoring/pr",
      },
      {
        title: "Monitoring Cash Advance (CA)",
        icon: "Banknote",
        path: "/qhse/monitoring/cash-advance",
      },
      {
        title: "Monitoring Voucher",
        icon: "Ticket",
        path: "/qhse/monitoring/voucher",
      },
      {
        title: "Monitoring Endorse Certificate",
        icon: "FileCheck",
        path: "/qhse/monitoring/endorse-certificate",
      },
      {
        title: "Monitoring Reimburse",
        icon: "Wallet",
        path: "/qhse/monitoring/reimburse",
      },
    ],
  },
  {
    title: "Monitoring Gudang",
    icon: "Boxes",
    items: [
      {
        title: "Monitoring Manifest Barang",
        icon: "Package",
        path: "/qhse/monitoring-gudang/manifest-barang",
      },
      {
        title: "Monitoring Permintaan Barang Gudang (PBG)",
        icon: "ClipboardList",
        path: "/qhse/monitoring-gudang/pbg",
      },
      {
        title: "Monitoring Request for Inspection (RFI)",
        icon: "FileSearch",
        path: "/qhse/monitoring-gudang/rfi",
      },
    ],
  },
  {
    title: "ISO System",
    icon: "Book",
    items: [
      {
        title: "Daftar Induk Dokumen Internal",
        icon: "FileText",
        path: "/qhse/iso/daftar-induk-dokumen-internal",
      },
    ],
  },

  createGeneralMenu("operational"),
];

export const accountingMenu: MenuSection[] = [
  {
    title: "Main Dashboard",
    icon: "Home",
    items: [],
    directPath: "/accounting/dashboard",
  },
  {
    title: "Master COA",
    icon: "BookText",
    items: [],
    directPath: "/accounting/master-coa",
  },
  {
    title: "Jurnal",
    icon: "ClipboardList",
    subSections: [
      {
        title: "Jurnal",
        icon: "ClipboardList",
        items: [
          {
            title: "Posting Jurnal",
            icon: "ClipboardList",
            path: "/accounting/posting-jurnal",
          },
          {
            title: "Jurnal Manual",
            icon: "ClipboardList",
            path: "/accounting/jurnal-manual",
          },
          {
            title: "Laporan Jurnal",
            icon: "FileText",
            path: "/accounting/laporan-jurnal",
          },
        ],
      },
    ],
  },
  {
    title: "Asset",
    icon: "Boxes",
    items: [],
    directPath: "/accounting/asset",
  },
  {
    title: "Trial Balance",
    icon: "ClipboardList",
    items: [],
    directPath: "/accounting/trial-balance",
  },
  {
    title: "Tutup Buku",
    icon: "BookX", // Icon for closing books
    items: [],
    directPath: "/accounting/tutup-buku",
  },
  {
    title: "Laba Rugi",
    icon: "TrendingUp", // Icon for profit/loss
    items: [],
    directPath: "/accounting/laba-rugi",
  },
  {
    title: "Neraca",
    icon: "Scale", // Icon for balance sheet
    items: [],
    directPath: "/accounting/neraca",
  },
  {
    title: "Kas",
    icon: "Wallet",
    subSections: [
      {
        title: "Kas",
        icon: "Wallet",
        items: [
          { title: "Kas Masuk", icon: "Wallet", path: "/accounting/kas-masuk" },
          {
            title: "Kas Keluar",
            icon: "CreditCard",
            path: "/accounting/kas-keluar",
          },
        ],
      },
    ],
  },
  {
    title: "Bank",
    icon: "Banknote",
    subSections: [
      {
        title: "Bank",
        icon: "Banknote",
        items: [
          {
            title: "Bank Masuk",
            icon: "Banknote",
            path: "/accounting/bank-masuk",
          },
          {
            title: "Bank Keluar",
            icon: "Landmark",
            path: "/accounting/bank-keluar",
          },
        ],
      },
    ],
  },
  {
    title: "Neraca",
    icon: "Scale", // Icon for balance sheet
    items: [],
    directPath: "/accounting/neraca",
  },
  createGeneralMenu("gudang"),
];

// Refined Tax Menu
export const taxMenu: MenuSection[] = [
  {
    title: "Pajak",
    icon: "Scale", // Icon for general tax section
    subSections: [
      {
        title: "Pajak", // Sub-section title, can be same as main section or more specific
        icon: "Scale", // Sub-section icon
        items: [
          {
            title: "Pajak Masukan",
            icon: "ArrowDownCircle",
            path: "/tax/pajak-masukan",
          },
          {
            title: "Pajak Keluaran",
            icon: "ArrowUpCircle",
            path: "/tax/pajak-keluaran",
          },
        ],
      },
    ],
  },
  {
    title: "PPH UNIFIKASI",
    icon: "Layers",
    items: [
      { title: "PPh 21", icon: "FileText", path: "/tax/pph-21" },
      { title: "PPh 23", icon: "FileText", path: "/tax/pph-23" },
      { title: "PPh 4 Ayat 2", icon: "FileText", path: "/tax/pph-4-ayat-2" },
      { title: "PPh 22", icon: "FileText", path: "/tax/pph-22" },
    ],
  },
  {
    title: "PPH BADAN",
    icon: "Briefcase",
    items: [
      { title: "PPh 29", icon: "FileText", path: "/tax/pph-29" },
      { title: "PPh 25", icon: "FileText", path: "/tax/pph-25" },
    ],
  },
  {
    title: "Tagihan Pajak Lainya",
    icon: "Receipt",
    items: [
      { title: "SKPKB", icon: "FileText", path: "/tax/tagihan/skpkb" },
      { title: "SP2DK", icon: "FileText", path: "/tax/tagihan/sp2dk" },
      { title: "STP", icon: "FileText", path: "/tax/tagihan/stp" },
    ],
  },
  {
    title: "Voucher Lainya",
    icon: "Ticket",
    items: [
      {
        title: "Voucher",
        icon: "FileText",
        path: "/tax/voucher-lainya/voucher",
      },
      {
        title: "Monitoring Voucher",
        icon: "FileText",
        path: "/tax/voucher-lainya/monitoring",
      },
    ],
  },
];

// Procon Menu
export const proconMenu: MenuSection[] = [
  {
    title: "Dashboard",
    icon: "Home",
    items: [],
    directPath: "/procon/dashboard",
  },
  {
    title: "Sales Order",
    icon: "ShoppingCart",
    items: [],
    directPath: "/marketing/sales-order/dashboard",
  },
  {
    title: "Proforma Invoice",
    icon: "ReceiptText",
    items: [
      {
        title: "Dashboard",
        icon: "LayoutDashboard",
        path: "/procon/proforma-invoice/dashboard",
      },
      {
        title: "Pembuatan PI",
        icon: "FilePlus",
        path: "/procon/proforma-invoice/pembuatan",
      },
    ],
  },
  {
    title: "Laba Rugi Project",
    icon: "TrendingUp",
    items: [
      {
        title: "Dashboard",
        icon: "LayoutDashboard",
        path: "/procon/lrp/dashboard",
      },
      {
        title: "Tunjangan / Timesheet Teknisi",
        icon: "UserCheck",
        path: "/procon/lrp/tunjangan-timesheet-teknisi",
      },
      { title: "Gaji", icon: "Wallet", path: "/hrd/gaji/pengajian" },
      {
        title: "Timesheet Barang",
        icon: "Package",
        path: "/operational/timesheet/barang",
      },
      { title: "Kas Keluar", icon: "Wallet", path: "/accounting/kas-keluar" },
      {
        title: "Bank Keluar",
        icon: "Banknote",
        path: "/accounting/bank-keluar",
      },
    ],
  },
  // New sections requested for Procon: Marketing, Operasional, Procurement, Finance
  {
    title: "Marketing",
    icon: "Megaphone",
    items: [
      {
        title: "Kontrak Deal",
        icon: "FileCheck",
        path: "/marketing/kontrak-deal/dashboard",
      },
      {
        title: "HPP Induk",
        icon: "Calculator",
        path: "/marketing/hpp-induk/dashboard",
      },
      {
        title: "Sales Order",
        icon: "ShoppingCart",
        path: "/marketing/sales-order/dashboard",
      },
      {
        title: "Kick Off Meeting",
        icon: "Users",
        path: "/marketing/kontrak-deal/dashboard",
      },
      {
        title: "Insentif Marketing",
        icon: "Award",
        path: "/marketing/insentif-marketing/dashboard",
      },
    ],
  },
  {
    title: "Operasional",
    icon: "Settings",
    items: [
      {
        title: "HPP Turunan",
        icon: "Calculator",
        path: "/operational/hpp-turunan/dashboard",
      },
      {
        title: "Proses Produksi",
        icon: "Cog",
        path: "/operational/produksi/proses",
      },
      {
        title: "Timesheet",
        icon: "Clock",
        path: "/operational/timesheet/dashboard",
      },
      {
        title: "Report",
        icon: "FileText",
        path: "/operational/produksi/dashboard",
      },
    ],
  },
  {
    title: "Procurement",
    icon: "ShoppingCart",
    items: [
      {
        title: "Dashboard Purchase Request",
        icon: "LayoutDashboard",
        path: "/procon/purchase-request/dashboard",
      },
      {
        title: "Proses Purchase Request",
        icon: "FilePlus",
        path: "/procon/purchase-request/proses",
      },
      {
        title: "Approval Purchase Request",
        icon: "CheckCircle",
        path: "/procon/purchase-request/approval",
      },
    ],
  },
  {
    title: "Finance",
    icon: "DollarSign",
    items: [
      {
        title: "Dashboard AR",
        icon: "LayoutDashboard",
        path: "/finance/ar/dashboard",
      },
      {
        title: "Bukti Kas Keluar",
        icon: "FilePlus",
        path: "/finance/kas/bukti-kas-keluar",
      },
      {
        title: "Bukti Bank Keluar",
        icon: "CheckCircle",
        path: "/finance/bank/bukti-bank-keluar",
      },
    ],
  },
  createGeneralMenu("procon"),
];
