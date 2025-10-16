import React, { useState } from "react";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Receipt,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface BudgetItem {
  id: string;
  kodeAkun: string; // New field for 'Kode Akun'
  namaAkun: string; // Renamed from 'kategori' to 'Nama Akun'
  mu: string; // New field for 'MU'
  subtotalMu: number; // New field for 'Subtotal MU'
  subtotalRp: number; // New field for 'Subtotal Rp'
  realisasiMu: number; // New field for 'Realisasi MU'
  realisasiRp: number; // New field for 'Realisasi Rp'
  sisaMu: number; // New field for 'Sisa MU'
  sisaRp: number; // New field for 'Sisa Rp'
  stat: string; // New field for 'Stat'
  nilaiBudget: number; // Existing field, will be used for one of the 'Subtotal' or 'Sisa' values if needed
  nilaiPemakaian: number; // Existing field
  nilaiSisa: number; // Existing field
  persentaseSisa: number; // Existing field
  sumberPO: number;
  sumberVoucher: number;
  noPO?: string;
  noVoucher?: string;
}

interface POItem {
  noPO: string;
  keterangan: string;
  nominal: number;
}

interface VoucherItem {
  noVoucher: string;
  keterangan: string;
  nominal: number;
}

const BudgetKantorDashboard: React.FC = () => {
  const today = new Date();

  // Master Data PO
  const masterPO: POItem[] = [
    { noPO: "PO-2024-001", keterangan: "Pembelian ATK", nominal: 25000000 },
    {
      noPO: "PO-2024-002",
      keterangan: "Pembelian Furniture",
      nominal: 65000000,
    },
    {
      noPO: "PO-2024-003",
      keterangan: "Pembelian Software",
      nominal: 50000000,
    },
    {
      noPO: "PO-2024-004",
      keterangan: "Pembelian Peralatan Kantor",
      nominal: 40000000,
    },
    {
      noPO: "PO-2024-005",
      keterangan: "Pembelian Konsumsi",
      nominal: 15000000,
    },
    {
      noPO: "PO-2024-006",
      keterangan: "Pembelian Alat Kebersihan",
      nominal: 12000000,
    },
  ];

  // Master Data Voucher
  const masterVoucher: VoucherItem[] = [
    {
      noVoucher: "VCH-2024-001",
      keterangan: "Pembayaran Listrik",
      nominal: 42000000,
    },
    {
      noVoucher: "VCH-2024-002",
      keterangan: "Biaya Transportasi",
      nominal: 28500000,
    },
    {
      noVoucher: "VCH-2024-003",
      keterangan: "Biaya Konsumsi Rapat",
      nominal: 7000000,
    },
    {
      noVoucher: "VCH-2024-004",
      keterangan: "Biaya ATK Tambahan",
      nominal: 7500000,
    },
    {
      noVoucher: "VCH-2024-005",
      keterangan: "Biaya Software Lisensi",
      nominal: 8000000,
    },
    {
      noVoucher: "VCH-2024-006",
      keterangan: "Biaya Maintenance",
      nominal: 5000000,
    },
    {
      noVoucher: "VCH-2024-007",
      keterangan: "Biaya Kebersihan",
      nominal: 6500000,
    },
  ];

  // State Management
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([
    {
      id: "1",
      kodeAkun: "1101",
      namaAkun: "Kas",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 50000000,
      nilaiPemakaian: 32500000,
      nilaiSisa: 17500000,
      persentaseSisa: 35,
      sumberPO: 25000000,
      sumberVoucher: 7500000,
    },
    {
      id: "2",
      kodeAkun: "1102",
      namaAkun: "Piutang Usaha",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 30000000,
      nilaiPemakaian: 22000000,
      nilaiSisa: 8000000,
      persentaseSisa: 26.67,
      sumberPO: 15000000,
      sumberVoucher: 7000000,
    },
    {
      id: "3",
      kodeAkun: "1103",
      namaAkun: "Persediaan Barang",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 75000000,
      nilaiPemakaian: 45000000,
      nilaiSisa: 30000000,
      persentaseSisa: 40,
      sumberPO: 40000000,
      sumberVoucher: 5000000,
    },
    {
      id: "4",
      kodeAkun: "1104",
      namaAkun: "Biaya Operasional",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 40000000,
      nilaiPemakaian: 28500000,
      nilaiSisa: 11500000,
      persentaseSisa: 28.75,
      sumberPO: 0,
      sumberVoucher: 28500000,
    },
    {
      id: "5",
      kodeAkun: "1105",
      namaAkun: "Biaya Utilitas",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 60000000,
      nilaiPemakaian: 42000000,
      nilaiSisa: 18000000,
      persentaseSisa: 30,
      sumberPO: 0,
      sumberVoucher: 42000000,
    },
    {
      id: "6",
      kodeAkun: "1106",
      namaAkun: "Peralatan & Furniture",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 100000000,
      nilaiPemakaian: 65000000,
      nilaiSisa: 35000000,
      persentaseSisa: 35,
      sumberPO: 65000000,
      sumberVoucher: 0,
    },
    {
      id: "7",
      kodeAkun: "1107",
      namaAkun: "IT & Software",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 80000000,
      nilaiPemakaian: 58000000,
      nilaiSisa: 22000000,
      persentaseSisa: 27.5,
      sumberPO: 50000000,
      sumberVoucher: 8000000,
    },
    {
      id: "8",
      kodeAkun: "1108",
      namaAkun: "Kebersihan & Sanitasi",
      mu: "Rp",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "Terbuka",
      nilaiBudget: 25000000,
      nilaiPemakaian: 18500000,
      nilaiSisa: 6500000,
      persentaseSisa: 26,
      sumberPO: 12000000,
      sumberVoucher: 6500000,
    },
  ]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<BudgetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BudgetItem | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    kodeAkun: "",
    namaAkun: "",
    mu: "",
    subtotalMu: 0,
    subtotalRp: 0,
    realisasiMu: 0,
    realisasiRp: 0,
    sisaMu: 0,
    sisaRp: 0,
    stat: "",
    nilaiBudget: 0,
    sumberPO: 0,
    sumberVoucher: 0,
    noPO: "",
    noVoucher: "",
  });

  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // CRUD Functions
  const handleAdd = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({
      kodeAkun: "",
      namaAkun: "",
      mu: "",
      subtotalMu: 0,
      subtotalRp: 0,
      realisasiMu: 0,
      realisasiRp: 0,
      sisaMu: 0,
      sisaRp: 0,
      stat: "",
      nilaiBudget: 0,
      sumberPO: 0,
      sumberVoucher: 0,
      noPO: "",
      noVoucher: "",
    });
    setShowModal(true);
  };

  // Handle PO Selection
  const handlePOChange = (noPO: string) => {
    const selectedPO = masterPO.find((po) => po.noPO === noPO);
    if (selectedPO) {
      setFormData({
        ...formData,
        noPO: noPO,
        sumberPO: selectedPO.nominal,
      });
    } else {
      setFormData({
        ...formData,
        noPO: "",
        sumberPO: 0,
      });
    }
  };

  // Handle Voucher Selection
  const handleVoucherChange = (noVoucher: string) => {
    const selectedVoucher = masterVoucher.find(
      (v) => v.noVoucher === noVoucher
    );
    if (selectedVoucher) {
      setFormData({
        ...formData,
        noVoucher: noVoucher,
        sumberVoucher: selectedVoucher.nominal,
      });
    } else {
      setFormData({
        ...formData,
        noVoucher: "",
        sumberVoucher: 0,
      });
    }
  };

  const handleEdit = (item: BudgetItem) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({
      kodeAkun: item.kodeAkun,
      namaAkun: item.namaAkun,
      mu: item.mu,
      subtotalMu: item.subtotalMu,
      subtotalRp: item.subtotalRp,
      realisasiMu: item.realisasiMu,
      realisasiRp: item.realisasiRp,
      sisaMu: item.sisaMu,
      sisaRp: item.sisaRp,
      stat: item.stat,
      nilaiBudget: item.nilaiBudget,
      sumberPO: item.sumberPO,
      sumberVoucher: item.sumberVoucher,
      noPO: item.noPO || "",
      noVoucher: item.noVoucher || "",
    });
    setShowModal(true);
  };

  const handleDelete = (item: BudgetItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setBudgetData(budgetData.filter((item) => item.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleSave = () => {
    if (!formData.namaAkun || formData.nilaiBudget <= 0) {
      alert("Harap isi semua field yang diperlukan!");
      return;
    }

    const nilaiPemakaian = formData.sumberPO + formData.sumberVoucher;
    const nilaiSisa = formData.nilaiBudget - nilaiPemakaian;
    const persentaseSisa = (nilaiSisa / formData.nilaiBudget) * 100;

    if (isEditing && currentItem) {
      // Update existing item
      setBudgetData(
        budgetData.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                kodeAkun: formData.kodeAkun,
                namaAkun: formData.namaAkun,
                mu: formData.mu,
                subtotalMu: formData.subtotalMu,
                subtotalRp: formData.subtotalRp,
                realisasiMu: formData.realisasiMu,
                realisasiRp: formData.realisasiRp,
                sisaMu: formData.sisaMu,
                sisaRp: formData.sisaRp,
                stat: formData.stat,
                nilaiBudget: formData.nilaiBudget,
                nilaiPemakaian,
                nilaiSisa,
                persentaseSisa,
                sumberPO: formData.sumberPO,
                sumberVoucher: formData.sumberVoucher,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        kodeAkun: formData.kodeAkun,
        namaAkun: formData.namaAkun,
        mu: formData.mu,
        subtotalMu: formData.subtotalMu,
        subtotalRp: formData.subtotalRp,
        realisasiMu: formData.realisasiMu,
        realisasiRp: formData.realisasiRp,
        sisaMu: formData.sisaMu,
        sisaRp: formData.sisaRp,
        stat: formData.stat,
        nilaiBudget: formData.nilaiBudget,
        nilaiPemakaian,
        nilaiSisa,
        persentaseSisa,
        sumberPO: formData.sumberPO,
        sumberVoucher: formData.sumberVoucher,
      };
      setBudgetData([...budgetData, newItem]);
    }

    setShowModal(false);
  };

  // Calculate totals
  const totalSubtotalMu = budgetData.reduce(
    (sum, item) => sum + item.subtotalMu,
    0
  );
  const totalSubtotalRp = budgetData.reduce(
    (sum, item) => sum + item.subtotalRp,
    0
  );
  const totalRealisasiMu = budgetData.reduce(
    (sum, item) => sum + item.realisasiMu,
    0
  );
  const totalRealisasiRp = budgetData.reduce(
    (sum, item) => sum + item.realisasiRp,
    0
  );
  const totalSisaMu = budgetData.reduce((sum, item) => sum + item.sisaMu, 0);
  const totalSisaRp = budgetData.reduce((sum, item) => sum + item.sisaRp, 0);

  // These totals might need to be re-evaluated based on the new column meanings
  const totalBudget = totalSubtotalRp; // Using Subtotal Rp as the main budget total
  const totalPemakaian = totalRealisasiRp; // Using Realisasi Rp as total expenditure
  const totalSisa = totalSisaRp; // Using Sisa Rp as total remaining budget

  // const totalPersentaseSisa = (totalSisa / totalBudget) * 100; // No longer directly used
  const totalPO = budgetData.reduce((sum, item) => sum + item.sumberPO, 0);
  const totalVoucher = budgetData.reduce(
    (sum, item) => sum + item.sumberVoucher,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                BUDGET KANTOR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Pengadaan
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Budget Kantor</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Budget
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(totalBudget)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Pemakaian
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(totalPemakaian)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sisa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(totalSisa)}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {totalSisa > 0
                    ? ((totalSisa / totalBudget) * 100).toFixed(2)
                    : 0}
                  % tersisa
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">
                    Dari PO
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatRupiah(totalPO)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">
                    Dari Voucher
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatRupiah(totalVoucher)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Rincian Budget per Kategori
            </h3>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Budget
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode Akun
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Akun
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MU
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal MU
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal Rp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realisasi MU
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realisasi Rp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sisa MU
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sisa Rp
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stat
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.kodeAkun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaAkun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.mu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {item.subtotalMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatRupiah(item.subtotalRp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {item.realisasiMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatRupiah(item.realisasiRp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {item.sisaMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatRupiah(item.sisaRp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.stat === "Terbuka"
                            ? "text-green-600 bg-green-100"
                            : "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {item.stat}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {totalSubtotalMu.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {formatRupiah(totalSubtotalRp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {totalRealisasiMu.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {formatRupiah(totalRealisasiRp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {totalSisaMu.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {formatRupiah(totalSisaRp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"></td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? "Edit Budget" : "Tambah Budget Baru"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Akun <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kodeAkun}
                    onChange={(e) =>
                      setFormData({ ...formData, kodeAkun: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 1101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Akun <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaAkun}
                    onChange={(e) =>
                      setFormData({ ...formData, namaAkun: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Kas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.mu}
                    onChange={(e) =>
                      setFormData({ ...formData, mu: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Rp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtotal MU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.subtotalMu}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subtotalMu: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtotal Rp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.subtotalRp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subtotalRp: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Realisasi MU
                  </label>
                  <input
                    type="number"
                    value={formData.realisasiMu}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        realisasiMu: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Realisasi Rp
                  </label>
                  <input
                    type="number"
                    value={formData.realisasiRp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        realisasiRp: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sisa MU
                  </label>
                  <input
                    type="number"
                    value={formData.sisaMu}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sisaMu: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sisa Rp
                  </label>
                  <input
                    type="number"
                    value={formData.sisaRp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sisaRp: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stat <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.stat}
                    onChange={(e) =>
                      setFormData({ ...formData, stat: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Pilih Stat --</option>
                    <option value="Terbuka">Terbuka</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 text-purple-600 mr-1" />
                    No PO
                  </label>
                  <select
                    value={formData.noPO}
                    onChange={(e) => handlePOChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">-- Pilih No PO --</option>
                    {masterPO.map((po) => (
                      <option key={po.noPO} value={po.noPO}>
                        {po.noPO} - {po.keterangan} ({formatRupiah(po.nominal)})
                      </option>
                    ))}
                  </select>
                  {formData.noPO && (
                    <p className="mt-1 text-xs text-purple-600 font-medium">
                      Nominal: {formatRupiah(formData.sumberPO)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Receipt className="inline h-4 w-4 text-orange-600 mr-1" />
                    No Voucher
                  </label>
                  <select
                    value={formData.noVoucher}
                    onChange={(e) => handleVoucherChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">-- Pilih No Voucher --</option>
                    {masterVoucher.map((voucher) => (
                      <option key={voucher.noVoucher} value={voucher.noVoucher}>
                        {voucher.noVoucher} - {voucher.keterangan} (
                        {formatRupiah(voucher.nominal)})
                      </option>
                    ))}
                  </select>
                  {formData.noVoucher && (
                    <p className="mt-1 text-xs text-orange-600 font-medium">
                      Nominal: {formatRupiah(formData.sumberVoucher)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Ringkasan Perhitungan:
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nilai Budget:</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiah(formData.nilaiBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nilai Pemakaian:</span>
                    <span className="font-semibold text-red-600">
                      {formatRupiah(formData.sumberPO + formData.sumberVoucher)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nilai Sisa:</span>
                    <span className="font-semibold text-green-600">
                      {formatRupiah(
                        formData.nilaiBudget -
                          (formData.sumberPO + formData.sumberVoucher)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Persentase Sisa:</span>
                    <span className="font-semibold text-blue-600">
                      {formData.nilaiBudget > 0
                        ? (
                            ((formData.nilaiBudget -
                              (formData.sumberPO + formData.sumberVoucher)) /
                              formData.nilaiBudget) *
                            100
                          ).toFixed(2)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? "Simpan Perubahan" : "Tambah Budget"}
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && itemToDelete && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            itemName={itemToDelete.namaAkun}
          />
        )}

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Keterangan Status Budget:
          </h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Terbuka</span>
            </div>
            {/* <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600">
                Perhatian (25-39% sisa)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600">
                Kritis (&lt; 25% sisa)
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetKantorDashboard;
