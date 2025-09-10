import React, { useState, useEffect } from "react";
import { X, Calendar, Save, Loader2, Plus, Trash2 } from "lucide-react";

interface SalesOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SalesOrderFormData) => void;
}

// Row types for tabs (shared to detail via onSave)
export type TenagaKerjaRow = {
  pegawai: string;
  tenaga: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
};
export type JasaRow = {
  jasa: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
};
export type AlatRow = {
  alat: string;
  harga: string;
  jumlah: string;
  hari: string;
  satuan: string;
  hargaSatuan: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
};
export type BarangRow = {
  namaBarang: string;
  harga: string;
  jumlah: string;
  hari: string;
  satuan: string;
  hargaSatuan: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
};
export type MobDemobRow = {
  namaTransportasi: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
};
export type BiayaLainRow = {
  namaBiaya: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
};

export interface SalesOrderFormData {
  nomorKontrak: string;
  namaClient: string;
  namaProyek: string;
  sow: string;
  lokasi: string;
  jenisPekerjaan: "On Call" | "Tender";
  tanggalMOB: string;
  tanggalDeMOB: string;
  tanggalDibuat: string;
  estimasiSO: string;
  keterangan: string; // Added new field
  // Tab data to persist for detail view
  tenagaKerja?: TenagaKerjaRow[];
  jasa?: JasaRow[];
  alat?: AlatRow[];
  barang?: BarangRow[];
  mobDemob?: MobDemobRow[];
  biayaLainLain?: BiayaLainRow[];
}

const SalesOrderModal: React.FC<SalesOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SalesOrderFormData>({
    nomorKontrak: "",
    namaClient: "",
    namaProyek: "",
    sow: "",
    lokasi: "",
    jenisPekerjaan: "On Call",
    tanggalMOB: "",
    tanggalDeMOB: "",
    tanggalDibuat: new Date().toISOString().split("T")[0],
    estimasiSO: "",
    keterangan: "", // Added initial state for new field
  });

  const [errors, setErrors] = useState<Partial<SalesOrderFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Tabs and table data (mirroring HPP Induk modal)
  const tabs = [
    "Tenaga Kerja",
    "Jasa",
    "Alat",
    "Barang",
    "MobDemob",
    "Biaya Lain-lain",
    "Sisa HPP",
  ];
  

  const [activeTab, setActiveTab] = useState<string>("Tenaga Kerja");
  // Ringkasan pekerjaan (kopi dari HPP Induk)
  type RingkasRow = { jenisPekerjaan: string; hargaSatuan: string; jumlah: string; total: string };
  const [pekerjaanRingkas, setPekerjaanRingkas] = useState<RingkasRow[]>([
    { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
  ]);
  const jenisPekerjaanUnitPrice: Record<string, number> = {
    "On Call": 1500000,
    "Tender": 2000000,
  };
  const [tenagaKerja, setTenagaKerja] = useState<TenagaKerjaRow[]>([
    {
      pegawai: "",
      tenaga: "",
      tunjangan: "",
      projectRate: "",
      hari: "",
      hargaAwal: "",
      margin: "",
      hargaAkhir: "",
    },
  ]);
  const [jasa, setJasa] = useState<JasaRow[]>([
    {
      jasa: "",
      tunjangan: "",
      projectRate: "",
      hari: "",
      hargaAwal: "",
      margin: "",
      hargaAkhir: "",
    },
  ]);
  const [alat, setAlat] = useState<AlatRow[]>([
    {
      alat: "",
      harga: "",
      jumlah: "",
      hari: "",
      satuan: "",
      hargaSatuan: "",
      hargaAwal: "",
      margin: "",
      hargaAkhir: "",
    },
  ]);
  const [barang, setBarang] = useState<BarangRow[]>([
    {
      namaBarang: "",
      harga: "",
      jumlah: "",
      hari: "",
      satuan: "",
      hargaSatuan: "",
      hargaAwal: "",
      margin: "",
      hargaAkhir: "",
    },
  ]);
  const [mobDemob, setMobDemob] = useState<MobDemobRow[]>([
    {
      namaTransportasi: "",
      tunjangan: "",
      projectRate: "",
      hari: "",
      hargaAwal: "",
      margin: "",
      hargaAkhir: "",
    },
  ]);
  const [biayaLainLain, setBiayaLainLain] = useState<BiayaLainRow[]>([
    {
      namaBiaya: "",
      tunjangan: "",
      projectRate: "",
      hari: "",
      hargaAwal: "",
      margin: "",
      hargaAkhir: "",
    },
  ]);

  // Sisa HPP tab now shows no data (placeholder only)

  const getCurrentTabData = () => {
    switch (activeTab) {
      case "Tenaga Kerja":
        return tenagaKerja;
      case "Jasa":
        return jasa;
      case "Alat":
        return alat;
      case "Barang":
        return barang;
      case "MobDemob":
        return mobDemob;
      case "Biaya Lain-lain":
        return biayaLainLain;
      default:
        return [] as any[];
    }
  };

  // Handlers Ringkasan Pekerjaan
  const addPekerjaanRow = () => {
    setPekerjaanRingkas((prev) => [
      ...prev,
      { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
    ]);
  };
  const removePekerjaanRow = (idx: number) => {
    setPekerjaanRingkas((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  };
  const updatePekerjaanRow = (
    idx: number,
    field: "jenisPekerjaan" | "jumlah",
    value: string
  ) => {
    setPekerjaanRingkas((prev) => {
      const next = [...prev];
      let row = { ...next[idx], [field]: value } as RingkasRow;
      // isi hargaSatuan dari mapping saat pilih jenis pekerjaan
      if (field === "jenisPekerjaan") {
        const unit = jenisPekerjaanUnitPrice[value] || 0;
        row.hargaSatuan = unit ? String(unit) : "";
      }
      const jumlahNum = parseFloat(field === "jumlah" ? value : row.jumlah || "0") || 0;
      const hargaNum = parseFloat(row.hargaSatuan || "0") || 0;
      row.total = jumlahNum > 0 && hargaNum > 0 ? String(jumlahNum * hargaNum) : row.total || "";
      next[idx] = row;

      // Auto-fill semua baris tab Tenaga Kerja & Barang, dan tambahkan 2 baris baru di masing-masing
      if (field === "jenisPekerjaan") {
        const unit = jenisPekerjaanUnitPrice[value] || 0;
        if (unit > 0) {
          // Tenaga Kerja
          const filledTK = tenagaKerja.map((r, i) => {
            const projectRate = unit;
            const hari = 1;
            const hargaAwal = projectRate * hari;
            const margin = 10;
            const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
            return {
              pegawai: pegawaiOptions[i % pegawaiOptions.length] || r.pegawai || "",
              tenaga: tenagaOptions[i % tenagaOptions.length] || r.tenaga || "",
              tunjangan: tunjanganOptions[i % tunjanganOptions.length] || r.tunjangan || "",
              projectRate: String(projectRate),
              hari: String(hari),
              hargaAwal: String(hargaAwal),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            } as TenagaKerjaRow;
          });
          const mkTK = (seed: number): TenagaKerjaRow => {
            const projectRate = unit;
            const hari = 1;
            const hargaAwal = projectRate * hari;
            const margin = 10;
            const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
            return {
              pegawai: pegawaiOptions[seed % pegawaiOptions.length] || "",
              tenaga: tenagaOptions[seed % tenagaOptions.length] || "",
              tunjangan: tunjanganOptions[seed % tunjanganOptions.length] || "",
              projectRate: String(projectRate),
              hari: String(hari),
              hargaAwal: String(hargaAwal),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          };
          setTenagaKerja([...filledTK, mkTK(filledTK.length), mkTK(filledTK.length + 1)]);

          // Barang
          const filledBRG = barang.map((r, i) => {
            const jumlah = 1;
            const harga = unit;
            const hargaSatuan = jumlah > 0 ? harga / jumlah : 0;
            const margin = 10;
            const hargaAkhir = harga + (harga * margin) / 100;
            return {
              namaBarang: barangOptions[i % barangOptions.length] || r.namaBarang || "",
              harga: String(harga),
              jumlah: String(jumlah),
              hari: r.hari || "",
              satuan: r.satuan || "Unit",
              hargaSatuan: String(hargaSatuan),
              hargaAwal: String(harga),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            } as BarangRow;
          });
          const mkBRG = (seed: number): BarangRow => {
            const jumlah = 1;
            const harga = unit;
            const hargaSatuan = jumlah > 0 ? harga / jumlah : 0;
            const margin = 10;
            const hargaAkhir = harga + (harga * margin) / 100;
            return {
              namaBarang: barangOptions[seed % barangOptions.length] || "",
              harga: String(harga),
              jumlah: String(jumlah),
              hari: "",
              satuan: "Unit",
              hargaSatuan: String(hargaSatuan),
              hargaAwal: String(harga),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          };
          setBarang([...filledBRG, mkBRG(filledBRG.length), mkBRG(filledBRG.length + 1)]);
        }
      }

      return next;
    });
  };

  const setCurrentTabData = (data: any[]) => {
    switch (activeTab) {
      case "Tenaga Kerja":
        setTenagaKerja(data as TenagaKerjaRow[]);
        break;
      case "Jasa":
        setJasa(data as JasaRow[]);
        break;
      case "Alat":
        setAlat(data as AlatRow[]);
        break;
      case "Barang":
        setBarang(data as BarangRow[]);
        break;
      case "MobDemob":
        setMobDemob(data as MobDemobRow[]);
        break;
      case "Biaya Lain-lain":
        setBiayaLainLain(data as BiayaLainRow[]);
        break;
    }
  };

  const handleTabDataChange = (index: number, field: string, value: string) => {
    const data = [...getCurrentTabData()];
    data[index] = { ...data[index], [field]: value };

    // Auto-calc hargaAkhir when margin or hargaAwal changes
    if (field === "margin" || field === "hargaAwal") {
      const hargaAwal =
        parseFloat(field === "hargaAwal" ? value : data[index].hargaAwal) || 0;
      const margin =
        parseFloat(field === "margin" ? value : data[index].margin) || 0;
      const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
      (data[index] as any).hargaAkhir = hargaAkhir.toString();
    }

    // Auto-calc hargaSatuan for Alat/Barang when harga or jumlah changes
    if (
      (activeTab === "Alat" || activeTab === "Barang") &&
      (field === "harga" || field === "jumlah")
    ) {
      const harga =
        parseFloat(field === "harga" ? value : (data[index] as any).harga) || 0;
      const jumlah =
        parseFloat(field === "jumlah" ? value : (data[index] as any).jumlah) ||
        0;
      if (jumlah > 0) {
        (data[index] as any).hargaSatuan = (harga / jumlah).toString();
      }
    }

    setCurrentTabData(data);
  };

  const addTabData = () => {
    switch (activeTab) {
      case "Tenaga Kerja":
        setTenagaKerja((prev) => [
          ...prev,
          {
            pegawai: "",
            tenaga: "",
            tunjangan: "",
            projectRate: "",
            hari: "",
            hargaAwal: "",
            margin: "",
            hargaAkhir: "",
          },
        ]);
        break;
      case "Jasa":
        setJasa((prev) => [
          ...prev,
          {
            jasa: "",
            tunjangan: "",
            projectRate: "",
            hari: "",
            hargaAwal: "",
            margin: "",
            hargaAkhir: "",
          },
        ]);
        break;
      case "Alat":
        setAlat((prev) => [
          ...prev,
          {
            alat: "",
            harga: "",
            jumlah: "",
            hari: "",
            satuan: "",
            hargaSatuan: "",
            hargaAwal: "",
            margin: "",
            hargaAkhir: "",
          },
        ]);
        break;
      case "Barang":
        setBarang((prev) => [
          ...prev,
          {
            namaBarang: "",
            harga: "",
            jumlah: "",
            hari: "",
            satuan: "",
            hargaSatuan: "",
            hargaAwal: "",
            margin: "",
            hargaAkhir: "",
          },
        ]);
        break;
      case "MobDemob":
        setMobDemob((prev) => [
          ...prev,
          {
            namaTransportasi: "",
            tunjangan: "",
            projectRate: "",
            hari: "",
            hargaAwal: "",
            margin: "",
            hargaAkhir: "",
          },
        ]);
        break;
      case "Biaya Lain-lain":
        setBiayaLainLain((prev) => [
          ...prev,
          {
            namaBiaya: "",
            tunjangan: "",
            projectRate: "",
            hari: "",
            hargaAwal: "",
            margin: "",
            hargaAkhir: "",
          },
        ]);
        break;
    }
  };

  const removeTabData = (index: number) => {
    switch (activeTab) {
      case "Tenaga Kerja":
        if (tenagaKerja.length > 1)
          setTenagaKerja((prev) => prev.filter((_, i) => i !== index));
        break;
      case "Jasa":
        if (jasa.length > 1)
          setJasa((prev) => prev.filter((_, i) => i !== index));
        break;
      case "Alat":
        if (alat.length > 1)
          setAlat((prev) => prev.filter((_, i) => i !== index));
        break;
      case "Barang":
        if (barang.length > 1)
          setBarang((prev) => prev.filter((_, i) => i !== index));
        break;
      case "MobDemob":
        if (mobDemob.length > 1)
          setMobDemob((prev) => prev.filter((_, i) => i !== index));
        break;
      case "Biaya Lain-lain":
        if (biayaLainLain.length > 1)
          setBiayaLainLain((prev) => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const clientOptions = [
    "Client A",
    "Client B",
    "Client C",
    "Client D",
    "PT Teknologi Maju",
    "CV Digital Solutions",
    "PT Industri Kreatif",
  ];

  const kontrakOptions = [
    "001/02/P0810",
    "001/03/P0811",
    "001/04/P0810",
    "002/02/P0819",
  ];

  // removed unused lokasiOptions

  // Searchable options for first column of each tab
  const tenagaOptions = [
    "Supervisor",
    "Engineer",
    "Technician",
    "Helper",
    "Safety Officer",
  ];
  const pegawaiOptions = [
    "Budi Santoso",
    "Siti Aminah",
    "Joko Susilo",
    "Dewi Lestari",
    "Agus Salim",
    "Ahmad Rizki",
    "Maya Putri",
  ];
  const jasaOptions = ["Jasa Inspeksi", "Jasa Maintenance", "Jasa Kalibrasi"];
  const tunjanganOptions = ["Uang Makan", "Transport", "Lembur"];
  const alatOptions = ["Forklift", "Crane", "Truck", "Compressor"];
  const barangOptions = ["Pipa 2 inch", "Valve 1 inch", "Kabel NYA", "Baut M8"];
  const transportOptions = [
    "Truck Wingbox",
    "Truck Engkel",
    "Pickup",
    "Bus",
    "Pesawat",
  ];
  const biayaOptions = [
    "Biaya Perjalanan",
    "Biaya Akomodasi",
    "Biaya Konsumsi",
    "Biaya Lainnya",
  ];

  // Lightweight searchable select (combobox) component
  const SearchSelect: React.FC<{
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
  }> = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
      setQuery(value);
    }, [value]);

    const filtered = options.filter((opt) =>
      opt.toLowerCase().includes((query || "").toLowerCase())
    );

    return (
      <div className="relative" ref={containerRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
          placeholder={placeholder}
        />
        {open && (
          <div className="absolute z-50 mt-1 w-full max-h-44 overflow-auto bg-white border border-gray-200 rounded shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-2 py-1 text-xs text-gray-500">Tidak ada hasil</div>
            ) : (
              filtered.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setQuery(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 text-xs hover:bg-blue-50 ${
                    opt === value ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SalesOrderFormData> = {};

    if (!formData.nomorKontrak.trim()) {
      newErrors.nomorKontrak = "Nomor Kontrak wajib diisi";
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = "Nama Client wajib diisi";
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = "Nama Proyek wajib diisi";
    }

    if (!formData.sow.trim()) {
      newErrors.sow = "SOW wajib diisi";
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi wajib diisi";
    }

    if (!formData.estimasiSO.trim()) {
      newErrors.estimasiSO = "Estimasi SO wajib diisi";
    }

    if (!formData.keterangan.trim()) {
      // Added validation for keterangan
      newErrors.keterangan = "Keterangan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof SalesOrderFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSave({
      ...formData,
      tenagaKerja,
      jasa,
      alat,
      barang,
      mobDemob,
      biayaLainLain,
    });
    setIsLoading(false);

    // Reset form
    setFormData({
      nomorKontrak: "",
      namaClient: "",
      namaProyek: "",
      sow: "",
      lokasi: "",
      jenisPekerjaan: "On Call",
      tanggalMOB: "",
      tanggalDeMOB: "",
      tanggalDibuat: new Date().toISOString().split("T")[0],
      estimasiSO: "",
      keterangan: "", // Reset new field
    });
    setErrors({});
    // Reset tabs data
    setActiveTab("Tenaga Kerja");
    setTenagaKerja([
      {
        pegawai: "",
        tenaga: "",
        tunjangan: "",
        projectRate: "",
        hari: "",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ]);
    setJasa([
      {
        jasa: "",
        tunjangan: "",
        projectRate: "",
        hari: "",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ]);
    setAlat([
      {
        alat: "",
        harga: "",
        jumlah: "",
        hari: "",
        satuan: "",
        hargaSatuan: "",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ]);
    setBarang([
      {
        namaBarang: "",
        harga: "",
        jumlah: "",
        hari: "",
        satuan: "",
        hargaSatuan: "",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ]);
    setMobDemob([
      {
        namaTransportasi: "",
        tunjangan: "",
        projectRate: "",
        hari: "",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ]);
    setBiayaLainLain([
      {
        namaBiaya: "",
        tunjangan: "",
        projectRate: "",
        hari: "",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ]);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Entry Sales Order
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Auto-generated No SO Display */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No SO
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-medium text-xs">
                  SO{String(Date.now()).slice(-6)}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Nomor SO akan dibuat otomatis
                </p>
              </div>
              {/* Nomor Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nomor Kontrak <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.nomorKontrak}
                  onChange={(e) =>
                    handleInputChange("nomorKontrak", e.target.value)
                  }
                  className={`w-full px-2 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.nomorKontrak
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih Nomor Kontrak</option>
                  {kontrakOptions.map((kontrak) => (
                    <option key={kontrak} value={kontrak}>
                      {kontrak}
                    </option>
                  ))}
                </select>
                {errors.nomorKontrak && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.nomorKontrak}
                  </p>
                )}
              </div>
              {/* Nama Client */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) =>
                    handleInputChange("namaClient", e.target.value)
                  }
                  className={`w-full px-2 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.namaClient
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih Nama Client</option>
                  {clientOptions.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
                {errors.namaClient && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.namaClient}
                  </p>
                )}
              </div>

              {/* Jenis Pekerjaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jenis Pekerjaan
                </label>
                <select
                  value={formData.jenisPekerjaan}
                  onChange={(e) =>
                    handleInputChange(
                      "jenisPekerjaan",
                      e.target.value as "On Call" | "Tender"
                    )
                  }
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                >
                  <option value="On Call">On Call</option>
                  <option value="Tender">Tender</option>
                </select>
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaProyek}
                  onChange={(e) =>
                    handleInputChange("namaProyek", e.target.value)
                  }
                  className={`w-full px-2 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.namaProyek
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Masukkan nama proyek"
                />
                {errors.namaProyek && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.namaProyek}
                  </p>
                )}
              </div>
              {/* Lokasi - moved next to Nama Proyek */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => handleInputChange("lokasi", e.target.value)}
                  className={`w-full px-2 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.lokasi ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Lokasi"
                />
                {errors.lokasi && (
                  <p className="mt-1 text-xs text-red-600">{errors.lokasi}</p>
                )}
              </div>


              {/* Tanggal Dibuat */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tanggal Dibuat
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalDibuat}
                    onChange={(e) =>
                      handleInputChange("tanggalDibuat", e.target.value)
                    }
                    className="w-full px-2 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* SOW */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SOW <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.sow}
                  onChange={(e) => handleInputChange("sow", e.target.value)}
                  rows={3}
                  className={`w-full px-2 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.sow ? "border-red-300 bg-red-50" : "border-gray-200"
                  } resize-none`}
                  placeholder="Masukkan scope of work..."
                />
                {errors.sow && (
                  <p className="mt-1 text-xs text-red-600">{errors.sow}</p>
                )}
              </div>

              {/* Lokasi - old position hidden to avoid duplicate */}
              <div className="hidden"></div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => handleInputChange("keterangan", e.target.value)}
                  rows={3}
                  className={`w-full px-2 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.keterangan ? "border-red-300 bg-red-50" : "border-gray-200"
                  } resize-none`}
                  placeholder="Masukkan keterangan"
                />
                {errors.keterangan && (
                  <p className="mt-1 text-xs text-red-600">{errors.keterangan}</p>
                )}
              </div>

              {/* Ringkasan Pekerjaan (kopi HPP Induk) */}
              <div className="lg:col-span-2 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-900">Ringkasan Pekerjaan</h4>
                  <button
                    type="button"
                    onClick={addPekerjaanRow}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    <Plus className="h-3 w-3" /> Tambah
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Jenis Pekerjaan</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Harga Satuan</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Jumlah</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Total</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pekerjaanRingkas.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">
                            <select
                              value={row.jenisPekerjaan}
                              onChange={(e) => updatePekerjaanRow(idx, "jenisPekerjaan", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="">Pilih Jenis Pekerjaan</option>
                              <option value="On Call">On Call</option>
                              <option value="Tender">Tender</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={row.hargaSatuan} readOnly className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50" placeholder="Harga Satuan" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" min={0} value={row.jumlah} onChange={(e) => updatePekerjaanRow(idx, "jumlah", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded" placeholder="0" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={row.total} readOnly className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50" placeholder="Total" />
                          </td>
                          <td className="px-3 py-2">
                            <button type="button" onClick={() => removePekerjaanRow(idx)} disabled={pekerjaanRingkas.length === 1} className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tabs (same as HPP Induk) */}
            <div className="mt-8 mb-4">
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-blue-600 text-white border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - Tables */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab}
                </h3>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl text-xs">
                {/* Tenaga Kerja Table */}
                {activeTab === "Tenaga Kerja" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Pegawai
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Tenaga
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenagaKerja.map((row, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.pegawai}
                              onChange={(e) => handleTabDataChange(index, "pegawai", e.target.value)}
                              list={`pegawaiOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari pegawai"
                            />
                            <datalist id={`pegawaiOptions-${index}`}>
                              {pegawaiOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.tenaga}
                              onChange={(e) => handleTabDataChange(index, "tenaga", e.target.value)}
                              list={`tenagaOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari tenaga"
                            />
                            <datalist id={`tenagaOptions-${index}`}>
                              {tenagaOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.tunjangan}
                              onChange={(e) => handleTabDataChange(index, "tunjangan", e.target.value)}
                              list={`tunjanganOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari tunjangan"
                            />
                            <datalist id={`tunjanganOptions-${index}`}>
                              {["Uang Makan","Transport","Lembur"].map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.projectRate}
                              onChange={(e) => handleTabDataChange(index, "projectRate", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.hari}
                              onChange={(e) => handleTabDataChange(index, "hari", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.margin}
                              onChange={(e) => handleTabDataChange(index, "margin", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={tenagaKerja.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Jasa Table */}
                {activeTab === "Jasa" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Jasa
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jasa.map((row, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.jasa}
                              onChange={(e) => handleTabDataChange(index, "jasa", e.target.value)}
                              list={`jasaOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari jasa"
                            />
                            <datalist id={`jasaOptions-${index}`}>
                              {jasaOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.tunjangan}
                              onChange={(e) => handleTabDataChange(index, "tunjangan", e.target.value)}
                              list={`tunjanganJasaOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari tunjangan"
                            />
                            <datalist id={`tunjanganJasaOptions-${index}`}>
                              {["Uang Makan","Transport","Lembur"].map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.projectRate}
                              onChange={(e) => handleTabDataChange(index, "projectRate", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.hari}
                              onChange={(e) => handleTabDataChange(index, "hari", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.margin}
                              onChange={(e) => handleTabDataChange(index, "margin", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={jasa.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Alat Table */}
                {activeTab === "Alat" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Alat
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Satuan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {alat.map((row, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.alat}
                              onChange={(e) => handleTabDataChange(index, "alat", e.target.value)}
                              list={`alatOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari alat"
                            />
                            <datalist id={`alatOptions-${index}`}>
                              {alatOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.jumlah}
                              onChange={(e) => handleTabDataChange(index, "jumlah", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.hari}
                              onChange={(e) => handleTabDataChange(index, "hari", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.satuan}
                              onChange={(e) => handleTabDataChange(index, "satuan", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Satuan"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.hargaSatuan}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.margin}
                              onChange={(e) => handleTabDataChange(index, "margin", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={alat.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Barang Table */}
                {activeTab === "Barang" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Nama Barang
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Satuan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {barang.map((row, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.namaBarang}
                              onChange={(e) => handleTabDataChange(index, "namaBarang", e.target.value)}
                              list={`barangOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari barang"
                            />
                            <datalist id={`barangOptions-${index}`}>
                              {barangOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.jumlah}
                              onChange={(e) => handleTabDataChange(index, "jumlah", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={row.hari}
                              onChange={(e) => handleTabDataChange(index, "hari", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={row.satuan}
                              onChange={(e) => handleTabDataChange(index, "satuan", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Satuan"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={row.hargaSatuan}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={row.margin}
                              onChange={(e) => handleTabDataChange(index, "margin", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={barang.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* MobDemob Table */}
                {activeTab === "MobDemob" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Nama Transportasi
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Harga Awal
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mobDemob.map((item, index) => (
                        <tr key={index}>
                          <td className="px-2 py-1">
                            <SearchSelect
                              value={item.namaTransportasi}
                              onChange={(val) =>
                                handleTabDataChange(
                                  index,
                                  "namaTransportasi",
                                  val
                                )
                              }
                              options={transportOptions}
                              placeholder="Nama Transportasi"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={item.tunjangan}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "tunjangan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Tunjangan"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={item.projectRate}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "projectRate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hari",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hargaAwal",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={mobDemob.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Biaya Lain-lain Table */}
                {activeTab === "Biaya Lain-lain" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Nama Biaya
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Awal
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {biayaLainLain.map((item, index) => (
                        <tr key={index}>
                          <td className="px-2 py-1">
                            <SearchSelect
                              value={item.namaBiaya}
                              onChange={(val) =>
                                handleTabDataChange(index, "namaBiaya", val)
                              }
                              options={biayaOptions}
                              placeholder="Nama Biaya"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={item.tunjangan}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "tunjangan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Tunjangan"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={item.projectRate}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "projectRate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hari",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hargaAwal",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={biayaLainLain.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Sisa HPP - Empty placeholder (no data) */}
                {activeTab === "Sisa HPP" && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sisa HPP
                    </h3>
                    <p className="text-gray-600">
                      Tidak ada data ditampilkan pada tab ini.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={addTabData}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Baris</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderModal;
