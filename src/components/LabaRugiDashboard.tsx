import React, { useState } from "react";
import {
  Clock,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";
import Modal from "./Modal";

interface LabaRugiEntry {
  id: string;
  periode: string; // yyyy-mm
  akun: string; // kode akun
  namaAkun: string;
  mu: string;
  debitMu: number;
  kreditMu: number;
  debit: number; // Debet (Rp.)
  kredit: number; // Kredit (Rp.)
  keterangan: string;
}

const LabaRugiDashboard: React.FC = () => {
  const today = new Date();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["2025-07"]); // Default: Juli 2025
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LabaRugiEntry>({
    id: "",
    periode: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`,
    akun: "",
    namaAkun: "",
    mu: "IDR",
    debitMu: 0,
    kreditMu: 0,
    debit: 0,
    kredit: 0,
    keterangan: "",
  });

  const [labaRugiData, setLabaRugiData] = useState<LabaRugiEntry[]>([
    {
      id: "1",
      periode: "2025-07",
      akun: "40000000",
      namaAkun: "PENDAPATAN",
      mu: "IDR",
      debitMu: 0,
      kreditMu: 53827055,
      debit: 0,
      kredit: 53827055153,
      keterangan: "Pendapatan usaha",
    },
    {
      id: "2",
      periode: "2025-07",
      akun: "50000000",
      namaAkun: "BEBAN POKOK PENJUALAN",
      mu: "IDR",
      debitMu: 49936553,
      kreditMu: 0,
      debit: 49936552991,
      kredit: 0,
      keterangan: "Beban pokok penjualan",
    },
  ]);

  // Helper function to format numbers as per ID-ID locale (e.g., 123.456.789)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Dummy Data for Laba Rugi, structured to match the image
  const data = [
    {
      id: 1,
      no: "1",
      uraian: "PENDAPATAN",
      level: 0,
      isBold: true,
      juli: { real: 53827055153, rkap: 40421691158, percentage: 133 },
      sdJuli: { real: 330468485387, rkap: 279262762302, percentage: 118 },
      rkapTotal: { rkap: 472826071460, percentage: 70 },
    },
    {
      id: 2,
      no: "2",
      uraian: "BEBAN POKOK PENJUALAN",
      level: 0,
      isBold: true,
      juli: { real: -49936552991, rkap: -37586202233, percentage: 133 },
      sdJuli: { real: -306124253457, rkap: -259577708653, percentage: 118 },
      rkapTotal: { rkap: -439746702061, percentage: 70 },
    },
    {
      id: 3,
      no: "",
      uraian: "Laba Kotor",
      level: 1,
      isSummary: true,
      isBold: true,
      juli: { real: 3890502162, rkap: 2763104955, percentage: 141 },
      sdJuli: { real: 24344031930, rkap: 19685053649, percentage: 124 },
      rkapTotal: { rkap: 213248362807, percentage: 11 },
    },
    {
      id: 4,
      no: "3",
      uraian: "Beban Usaha",
      level: 0,
      isBold: true,
      juli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      sdJuli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      rkapTotal: { rkap: 0, percentage: 0 }, // Sum of sub-items
    },
    {
      id: 5,
      no: "",
      uraian: "- BEBAN PENJUALAN",
      level: 1,
      juli: { real: -95185450, rkap: -40000000, percentage: 238 },
      sdJuli: { real: -251735471, rkap: -231300000, percentage: 109 },
      rkapTotal: { rkap: -334600000, percentage: 75 },
    },
    {
      id: 6,
      no: "",
      uraian: "- BEBAN KARYAWAN",
      level: 1,
      juli: { real: -942832346, rkap: -901911431, percentage: 105 },
      sdJuli: { real: -7210165594, rkap: -6512219936, percentage: 111 },
      rkapTotal: { rkap: -10983826441, percentage: 66 },
    },
    {
      id: 7,
      no: "",
      uraian: "- BEBAN UMUM KANTOR",
      level: 1,
      juli: { real: -547148449, rkap: -451740834, percentage: 121 },
      sdJuli: { real: 2797170554, rkap: -3346493838, percentage: 84 },
      rkapTotal: { rkap: -4943194008, percentage: 57 },
    },
    {
      id: 8,
      no: "",
      uraian: "- BEBAN PENYUSUTAN",
      level: 1,
      juli: { real: -106033033, rkap: -99698453, percentage: 106 },
      sdJuli: { real: -745126565, rkap: -662223408, percentage: 113 },
      rkapTotal: { rkap: -1163285291, percentage: 64 },
    },
    {
      id: 9,
      no: "",
      uraian: "Jumlah Beban Usaha",
      level: 1,
      isSummary: true,
      isBold: true,
      juli: { real: -1691199278, rkap: -1493350718, percentage: 113 },
      sdJuli: { real: -11004198184, rkap: -10752237182, percentage: 102 },
      rkapTotal: { rkap: -17424905746, percentage: 7 },
    },
    {
      id: 10,
      no: "",
      uraian: "Laba/(rugi) Usaha",
      level: 1,
      isSummary: true,
      isBold: true,
      juli: { real: 2199305884, rkap: 1269754237, percentage: 173 },
      sdJuli: { real: 13339833749, rkap: 8932816467, percentage: 149 },
      rkapTotal: { rkap: 195823457067, percentage: 10 },
    },
    {
      id: 11,
      no: "4",
      uraian: "Pendapatan & Beban Lain-lain",
      level: 0,
      isBold: true,
      juli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      sdJuli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      rkapTotal: { rkap: 0, percentage: 0 }, // Sum of sub-items
    },
    {
      id: 12,
      no: "",
      uraian: "- PENDAPATAN / BEBAN DILUAR USAHA",
      level: 1,
      juli: { real: 34613527, rkap: 19500000, percentage: 178 },
      sdJuli: { real: 152960663, rkap: 136500000, percentage: 112 },
      rkapTotal: { rkap: 234000000, percentage: 65 },
    },
    {
      id: 13,
      no: "",
      uraian: "- BEBAN DILUAR USAHA",
      level: 1,
      juli: { real: -47275198, rkap: -47022177, percentage: 101 },
      sdJuli: { real: -386641406, rkap: -353740527, percentage: 109 },
      rkapTotal: { rkap: -623374723, percentage: 62 },
    },
    {
      id: 14,
      no: "",
      uraian: "- BEBAN BUNGA HG",
      level: 1,
      juli: { real: -21676982, rkap: -5657473, percentage: 383 },
      sdJuli: { real: -109810801, rkap: -24585288, percentage: 58 },
      rkapTotal: { rkap: -59108399, percentage: "INF" }, // 'INF' as per image
    },
    {
      id: 15,
      no: "",
      uraian: "- BEBAN BUNGA PINJAMAN",
      level: 1,
      juli: { real: -478459837, rkap: -481666666, percentage: 99 },
      sdJuli: { real: -3679577437, rkap: -3824999998, percentage: 96 },
      rkapTotal: { rkap: -6233333328, percentage: 59 },
    },
    {
      id: 16,
      no: "",
      uraian: "Jumlah Beban Lain-lain",
      level: 1,
      isSummary: true,
      isBold: true,
      juli: { real: -512798490, rkap: -514846316, percentage: 100 },
      sdJuli: { real: -4023068981, rkap: -4066825813, percentage: 99 },
      rkapTotal: { rkap: -6563599452, percentage: 61 },
    },
    {
      id: 17,
      no: "5",
      uraian: "Laba Sebelum Pajak",
      level: 0,
      isBold: true,
      juli: { real: 1686507394, rkap: 754907921, percentage: 223 },
      sdJuli: { real: 9316764768, rkap: 4865990654, percentage: 191 },
      rkapTotal: { rkap: 189259857615, percentage: 5 },
    },
    {
      id: 18,
      no: "6",
      uraian: "Estimasi Pajak",
      level: 0,
      isBold: true,
      juli: { real: -539682366, rkap: -241570535, percentage: 223 },
      sdJuli: { real: -2981364726, rkap: -1557117009, percentage: 191 },
      rkapTotal: { rkap: -60563154437, percentage: 7 },
    },
    {
      id: 19,
      no: "7",
      uraian: "Laba Setelah Pajak",
      level: 0,
      isBold: true,
      juli: { real: 1146825028, rkap: 513337386, percentage: 223 },
      sdJuli: { real: 6335400042, rkap: 3308873645, percentage: 191 },
      rkapTotal: { rkap: 128696703178, percentage: 5 },
    },
  ];

  // Filtered data based on search term (uraian)
  const filteredData = data.filter((item) =>
    item.uraian.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combined filtered data including new entries
  const combinedFilteredData = [
    ...filteredData,
    ...labaRugiData.filter(
      (item) =>
        item.namaAkun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.akun.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  ];

  // Note: Add/Edit actions have been removed per request

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.akun || !form.namaAkun) {
      alert("Kode Akun dan Nama Akun wajib diisi");
      return;
    }

    if (editingId) {
      setLabaRugiData((prev) =>
        prev.map((it) => (it.id === editingId ? { ...form, id: it.id } : it))
      );
    } else {
      setLabaRugiData((prev) => [{ ...form, id: `${Date.now()}` }, ...prev]);
    }
    setIsFormOpen(false);
  };

  // Delete action removed; keeping submit/export utilities intact

  const handleExport = (type: "excel" | "csv" | "pdf") => {
    alert(
      `Mengekspor data Laba Rugi ke format ${type}... (Fungsionalitas ini adalah placeholder)`
    );
    // Di aplikasi nyata, Anda akan mengimplementasikan logika ekspor yang sebenarnya di sini.
    // Ini mungkin melibatkan:
    // 1. Memformat data untuk format yang dipilih.
    // 2. Menggunakan pustaka seperti 'xlsx' untuk Excel, 'papaparse' untuk CSV, atau 'jspdf' untuk PDF.
    // 3. Memicu unduhan file.
  };

  // Available months for selection
  const availableMonths = [
    { value: "2025-01", label: "Januari 2025" },
    { value: "2025-02", label: "Februari 2025" },
    { value: "2025-03", label: "Maret 2025" },
    { value: "2025-04", label: "April 2025" },
    { value: "2025-05", label: "Mei 2025" },
    { value: "2025-06", label: "Juni 2025" },
    { value: "2025-07", label: "Juli 2025" },
    { value: "2025-08", label: "Agustus 2025" },
    { value: "2025-09", label: "September 2025" },
    { value: "2025-10", label: "Oktober 2025" },
    { value: "2025-11", label: "November 2025" },
    { value: "2025-12", label: "Desember 2025" },
  ];

  // Handle month selection
  const handleMonthToggle = (monthValue: string) => {
    setSelectedMonths(prev => {
      if (prev.includes(monthValue)) {
        // Prevent removing if it's the last selected month
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(m => m !== monthValue);
      } else {
        return [...prev, monthValue].sort();
      }
    });
  };

  // Handle select all months
  const handleSelectAll = () => {
    setSelectedMonths(availableMonths.map(m => m.value));
  };

  // Handle clear all months
  const handleClearAll = () => {
    // Keep at least one month selected (current month)
    const currentMonth = "2025-07"; // Juli 2025 as default
    setSelectedMonths([currentMonth]);
  };

  // Generate columns based on selected months
  const generateColumns = () => {
    if (selectedMonths.length === 1) {
      // Single month: Total, Selisih, Persen
      return [
        { key: 'total', label: 'Total' },
        { key: 'selisih', label: 'Selisih' },
        { key: 'persen', label: 'Persen (%)' }
      ];
    } else {
      // Multiple months: Bulan columns + Total, Selisih, Persen
      const monthColumns = selectedMonths.map(month => {
        const monthObj = availableMonths.find(m => m.value === month);
        return {
          key: month,
          label: monthObj ? monthObj.label.split(' ')[0] : month // Just month name
        };
      });
      return [
        ...monthColumns,
        { key: 'total', label: 'Total' },
        { key: 'selisih', label: 'Selisih' },
        { key: 'persen', label: 'Persen (%)' }
      ];
    }
  };

  const columns = generateColumns();

  type PLRow = {
    id: string;
    label: string;
    level?: number; // indentation level
    isHeader?: boolean; // section header like PENDAPATAN
    isTotal?: boolean; // total rows
    highlight?: boolean; // highlighted final row
    values: { [key: string]: number }; // Dynamic values based on selected months
  };

  // Generate sample data for each row based on selected months
  const generateRowValues = (baseValue: number = 0): { [key: string]: number } => {
    const values: { [key: string]: number } = {};
    
    // Generate values for each selected month
    selectedMonths.forEach(month => {
      values[month] = baseValue + Math.random() * 1000000;
    });
    
    // Calculate total from selected months only
    const monthlyTotal = selectedMonths.reduce((sum, month) => sum + (values[month] || 0), 0);
    values.total = monthlyTotal;
    
    // Calculate selisih (difference from target - simplified)
    values.selisih = values.total * 0.1; // 10% of total as example
    
    // Calculate percentage
    values.persen = values.total > 0 ? (values.selisih / values.total) * 100 : 0;
    
    return values;
  };

  const plRows: PLRow[] = [
    // PENDAPATAN
    {
      id: "hdr-pendapatan",
      label: "PENDAPATAN",
      isHeader: true,
      level: 0,
      values: generateRowValues(0),
    },
    {
      id: "pdpt-1",
      label: "Pendapatan Penjualan Material",
      level: 1,
      values: generateRowValues(5000000),
    },
    {
      id: "pdpt-2",
      label: "Pendapatan Jasa Inspeksi",
      level: 1,
      values: generateRowValues(3000000),
    },
    {
      id: "pdpt-3",
      label: "Pendapatan Jasa Inspeksi RAT",
      level: 1,
      values: generateRowValues(2000000),
    },
    {
      id: "pdpt-4",
      label: "Pendapatan Jasa Non Inspeksi",
      level: 1,
      values: generateRowValues(1500000),
    },
    {
      id: "pdpt-5",
      label: "Pendapatan Jasa Non Inspeksi RAT",
      level: 1,
      values: generateRowValues(1000000),
    },
    {
      id: "total-pendapatan",
      label: "Total PENDAPATAN",
      isTotal: true,
      level: 0,
      values: generateRowValues(12500000),
    },

    // BIAYA ATAS PENDAPATAN
    {
      id: "hdr-bap",
      label: "BIAYA ATAS PENDAPATAN",
      isHeader: true,
      level: 0,
      values: generateRowValues(0),
    },
    {
      id: "bap-1",
      label: "Tunjangan Proyek Karyawan Tetap & Kontrak",
      level: 1,
      values: generateRowValues(-2000000),
    },
    {
      id: "bap-2",
      label: "Biaya Material",
      level: 1,
      values: generateRowValues(-1500000),
    },
    {
      id: "bap-3",
      label: "Biaya Perlengkapan Project",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-4",
      label: "Biaya Transportasi Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-5",
      label: "Biaya Penginapan Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-6",
      label: "Biaya Sewa proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-7",
      label: "Biaya Pengiriman Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-8",
      label: "Biaya Rumah Tangga Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-9",
      label: "Biaya Administrasi Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-10",
      label: "Biaya Perbaikan Peralatan Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-11",
      label: "Biaya Training Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-12",
      label: "Biaya Pengujian Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-13",
      label: "Biaya Prosdure Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-14",
      label: "Biaya Kalibrasi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-15",
      label: "Biaya Komisi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-16",
      label: "Biaya Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bap-17",
      label: "Biaya Sparepart Proyek",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "total-bap",
      label: "Total BIAYA ATAS PENDAPATAN",
      isTotal: true,
      level: 0,
      values: generateRowValues(-8000000),
    },

    // BIAYA ADMINISTRASI & UMUM
    {
      id: "hdr-bau",
      label: "BIAYA ADMINISTRASI & UMUM",
      isHeader: true,
      level: 0,
      values: generateRowValues(0),
    },
    {
      id: "bau-1",
      label: "Biaya Gaji",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-2",
      label: "Biaya BPJS",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-3",
      label: "Tunjangan Raya",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-4",
      label: "Biaya Denda",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-5",
      label: "biaya Reimbusable",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-6",
      label: "Biaya Sewa",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-7",
      label: "Biaya Asuransi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-8",
      label: "Biaya Utilitiy",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-9",
      label: "Biaya Pulsa",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-10",
      label: "Biaya Transportasi Kantor",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-11",
      label: "Biaya ATK Kantor",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-12",
      label: "Biaya Konsultan",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-13",
      label: "Biaya Iklan & Promosi & Entertainment",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-14",
      label: "Biaya Akomodasi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-15",
      label: "Biaya Perjalanan Dinas",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-16",
      label: "Biaya BOD",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-17",
      label: "Biaya Garansi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-18",
      label: "Biaya Member",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-19",
      label: "Biaya HSE",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-20",
      label: "Biaya Kegiatan",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-21",
      label: "Biaya Pemeliharaan Kantor",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-22",
      label: "Biaya Perbaikan",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-23",
      label: "Biaya Spare Part",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-24",
      label: "Biaya Pajak",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-25",
      label: "Biaya Training dan Pengembangan",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-26",
      label: "Biaya Pengiriman",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-27",
      label: "Biaya Sertifikasi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-28",
      label: "Sumbangan & Zakat",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-29",
      label: "Biaya Pantry",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-30",
      label: "Biaya MCU Teknisi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-31",
      label: "Biaya Training Teknisi",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-32",
      label: "Biaya Lainnya",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-33",
      label: "Biaya Perlengkapan Kantor",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-34",
      label: "Biaya SIBperasional SIB",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-35",
      label: "Biaya Project",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-36",
      label: "Biaya Perijinan",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-37",
      label: "Biaya MCU Staff & Management",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-38",
      label: "Biaya di luar usaha",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-39",
      label: "Biaya Outsourcing",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-40",
      label: "Biaya Internship",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "bau-41",
      label: "Biaya Penyusutan",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "total-bau",
      label: "Total BIAYA ADMINISTASI & UMUM",
      isTotal: true,
      level: 0,
      values: generateRowValues(0),
    },

    // PENDAPATAN LUAR USAHA
    {
      id: "hdr-plu",
      label: "PENDAPATAN LUAR USAHA",
      isHeader: true,
      level: 0,
      values: generateRowValues(0),
    },
    {
      id: "plu-1",
      label: "Pendapatan Bunga Bank",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "plu-2",
      label: "Pendapatan Lainnya",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "total-plu",
      label: "Total PENDAPATAN LUAR USAHA",
      isTotal: true,
      level: 0,
      values: generateRowValues(0),
    },

    // PENGELUARAN LUAR USAHA
    {
      id: "glu-1",
      label: "Gain / Loss Dispossal Asset",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "blu-1",
      label: "Biaya Administrasi Bank",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "rlsk-1",
      label: "Rugi Laba Selisih Kurs",
      level: 1,
      values: generateRowValues(0),
    },
    {
      id: "total-pengeluaran-luar-usaha",
      label: "Total PENGELUARAN LUAR USAHA",
      isTotal: true,
      level: 0,
      values: generateRowValues(0),
    },

    // LABA / RUGI BERSIH SEBELUM PAJAK
    {
      id: "final",
      label: "LABA / RUGI BERSIH SEBELUM PAJAK",
      isTotal: true,
      highlight: true,
      level: 0,
      values: generateRowValues(4500000),
    },
  ];

  const filteredPLRows = plRows.filter((r) =>
    r.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN LABA RUGI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laba Rugi</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar: Search, Filter, Export */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari uraian..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-400" />
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-sm text-gray-700">Filter Periode</span>
              <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {selectedMonths.length}
              </div>
            </button>
          </div>

          <div className="flex justify-end items-center w-full">
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileText className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileDown className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Laba Rugi Table - monthly matrix */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-200 w-[380px]">
                    Uraian
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-200"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPLRows.map((row) => {
                  const rowClasses = [
                    row.isHeader ? "bg-gray-50" : "",
                    row.isTotal ? "font-semibold" : "",
                    row.highlight ? "bg-yellow-100" : "",
                  ].join(" ");
                  return (
                    <tr
                      key={row.id}
                      className={`${rowClasses} hover:bg-gray-50`}
                    >
                      <td className="px-4 py-2 text-sm text-gray-800 border-r border-gray-100">
                        <span style={{ paddingLeft: (row.level || 0) * 16 }}>
                          {row.label}
                        </span>
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-2 text-sm text-gray-900 text-right border-r border-gray-100"
                        >
                          {col.key === 'persen' 
                            ? `${(row.values[col.key] || 0).toFixed(1)}%`
                            : formatNumber(row.values[col.key] || 0)
                          }
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter Periode Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Periode Laporan"
        size="lg"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Bulan Dipilih:</span>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {selectedMonths.length} bulan
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {selectedMonths.length === 1 
                ? 'Tampilan: Total, Selisih, Persen'
                : 'Tampilan: Bulan, Total, Selisih, Persen'
              }
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {availableMonths.map((month) => {
              const isSelected = selectedMonths.includes(month.value);
              return (
                <label 
                  key={month.value} 
                  className={`
                    flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-blue-25'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMonthToggle(month.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {month.label.split(' ')[0]}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                      2025
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAll}
                  disabled={selectedMonths.length === availableMonths.length}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedMonths.length === availableMonths.length
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  Pilih Semua
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={selectedMonths.length === 1}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedMonths.length === 1
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 font-medium self-center">Preset:</span>
              <button
                onClick={() => setSelectedMonths(['2025-01', '2025-02', '2025-03'])}
                className="px-2 py-1 text-xs text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
              >
                Q1 (Jan-Mar)
              </button>
              <button
                onClick={() => setSelectedMonths(['2025-04', '2025-05', '2025-06'])}
                className="px-2 py-1 text-xs text-yellow-600 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors"
              >
                Q2 (Apr-Jun)
              </button>
              <button
                onClick={() => setSelectedMonths(['2025-07', '2025-08', '2025-09'])}
                className="px-2 py-1 text-xs text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
              >
                Q3 (Jul-Sep)
              </button>
              <button
                onClick={() => setSelectedMonths(['2025-10', '2025-11', '2025-12'])}
                className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                Q4 (Oct-Des)
              </button>
              <button
                onClick={() => setSelectedMonths(['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'])}
                className="px-2 py-1 text-xs text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
              >
                Semester 1
              </button>
              <button
                onClick={() => setSelectedMonths(['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'])}
                className="px-2 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Semester 2
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? "Edit Baris Laba Rugi" : "Tambah Baris Laba Rugi"}
        size="xl"
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left min-w-[120px]">
                    Kode Akun
                  </th>
                  <th className="px-3 py-2 text-left min-w-[150px]">
                    Nama Akun
                  </th>
                  <th className="px-3 py-2 text-left min-w-[80px]">MU</th>
                  <th className="px-3 py-2 text-right min-w-[100px]">
                    Debet (MU)
                  </th>
                  <th className="px-3 py-2 text-right min-w-[100px]">
                    Kredit (MU)
                  </th>
                  <th className="px-3 py-2 text-right min-w-[120px]">
                    Debet (Rp.)
                  </th>
                  <th className="px-3 py-2 text-right min-w-[120px]">
                    Kredit (Rp.)
                  </th>
                  <th className="px-3 py-2 text-left min-w-[150px]">
                    Keterangan
                  </th>
                  <th className="px-3 py-2 text-left min-w-[120px]">Periode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 min-w-[120px]">
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.akun}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, akun: e.target.value }))
                      }
                      placeholder="40000000"
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[150px]">
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.namaAkun}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, namaAkun: e.target.value }))
                      }
                      placeholder="Nama Akun"
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[80px]">
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.mu}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, mu: e.target.value }))
                      }
                      placeholder="IDR"
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[100px]">
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 text-right"
                      value={form.debitMu}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          debitMu: Number(e.target.value),
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[100px]">
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 text-right"
                      value={form.kreditMu}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          kreditMu: Number(e.target.value),
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[120px]">
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 text-right"
                      value={form.debit}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          debit: Number(e.target.value),
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[120px]">
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 text-right"
                      value={form.kredit}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          kredit: Number(e.target.value),
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[150px]">
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.keterangan}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, keterangan: e.target.value }))
                      }
                      placeholder="Keterangan"
                    />
                  </td>
                  <td className="px-3 py-2 min-w-[120px]">
                    <input
                      type="month"
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.periode}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, periode: e.target.value }))
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal removed */}
    </div>
  );
};

export default LabaRugiDashboard;
