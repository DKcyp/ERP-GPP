import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Save,
  Loader2,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

interface SOTurunanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SOTurunanFormData) => void;
  readOnly?: boolean;
  initialData?: Partial<SOTurunanFormData> | null;
}

export interface SOTurunanFormData {
  soInduk: string;
  soTurunan: string;
  nomorKontrak: string;
  namaProyek: string;
  namaClient: string;
  tanggalDibuat: string;
  jenisPekerjaan: string;
  tanggalMOB: string;
  tanggalDemob: string;
  estimasiSO: string;
  keterangan: string;
  statusSO?: "Open" | "Close";
  statusDitagihkan?: "Sudah Ditagihkan" | "Belum Ditagihkan";
  jumlahQty?: string;
  pekerjaanRingkas?: Array<{
    jenisPekerjaan: string;
    hargaSatuan: string;
    jumlah: string;
    total: string;
  }>;
}

const SOTurunanModal: React.FC<SOTurunanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  readOnly = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<SOTurunanFormData>({
    soInduk: "",
    soTurunan: "",
    nomorKontrak: "",
    namaProyek: "",
    namaClient: "",
    tanggalDibuat: new Date().toISOString().split("T")[0],
    jenisPekerjaan: "",
    tanggalMOB: "",
    tanggalDemob: "",
    estimasiSO: "",
    keterangan: "",
    statusSO: "Open", // Default status
    statusDitagihkan: "Belum Ditagihkan", // Default status
    jumlahQty: "",
    pekerjaanRingkas: [
      { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
    ],
  });

  const [errors, setErrors] = useState<Partial<SOTurunanFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const isProcess = !!initialData; // when opened from "Proses" with prefilled data

  const soIndukOptions = ["SO001", "SO002", "SO003", "SO004", "SO005"];

  const jenisPekerjaanOptions = [
    "On Call",
    "Project Based",
    "Maintenance",
    "Consulting",
  ];

  const clientOptions = [
    "PT Adem Ayem",
    "PT Permata Buana",
    "CV Sejahtera",
    "CV Makmur",
    "PT WorkHome",
  ];

  // Tabs state (mirroring Sales Order)
  const tabs = [
    "Tenaga Kerja",
    "Jasa",
    "Alat",
    "Barang & Consumeble",
    "PPE",
    "MobDemob",
    "Biaya Lain-lain",
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [tenagaKerja, setTenagaKerja] = useState<any[]>([
    {
      pegawai: "Budi Santoso",
      tenaga: "Teknisi",
      tunjangan: "Uang Makan",
      projectRate: "250000",
      hari: "5",
      unit: "Hari",
      margin: "10",
      hargaAkhir: "1375000",
    },
  ]);
  const [ppe, setPpe] = useState<any[]>([
    {
      namaBarang: "Safety Helmet",
      jumlah: "1",
      hari: "1",
      satuan: "Unit",
      hargaSatuan: "",
      margin: "10",
      hargaAkhir: "",
    },
  ]);
  const [jasa, setJasa] = useState<any[]>([
    {
      jasa: "Maintenance",
      tunjangan: "Transport",
      projectRate: "500000",
      hari: "2",
      unit: "Hari",
      margin: "15",
      hargaAkhir: "1150000",
    },
  ]);
  const [alat, setAlat] = useState<any[]>([
    {
      alat: "Forklift",
      jumlah: "1",
      hari: "2",
      satuan: "unit",
      hargaSatuan: "1500000",
      margin: "5",
      hargaAkhir: "1575000",
    },
  ]);
  const [barang, setBarang] = useState<any[]>([
    {
      namaBarang: "Kabel NYA",
      jumlah: "100",
      hari: "1",
      satuan: "meter",
      hargaSatuan: "5000",
      margin: "10",
      hargaAkhir: "550000",
    },
  ]);
  const [mobDemob, setMobDemob] = useState<any[]>([
    {
      namaTransportasi: "Truck",
      tunjangan: "-",
      projectRate: "200000",
      hari: "1",
      satuan: "Unit",
      margin: "5",
      hargaAkhir: "210000",
    },
  ]);
  const [biayaLainLain, setBiayaLainLain] = useState<any[]>([
    {
      namaBiaya: "BBM",
      tunjangan: "-",
      projectRate: "300000",
      hari: "1",
      satuan: "Unit",
      margin: "5",
      hargaAkhir: "315000",
    },
  ]);

  // Options for datalists
  const tenagaOptions = ["Teknisi", "Supervisor", "Operator", "Admin"];
  const pegawaiOptions = [
    "Budi Santoso",
    "Siti Aminah",
    "Joko Susilo",
    "Dewi Lestari",
    "Agus Salim",
    "Ahmad Rizki",
    "Maya Putri",
  ];
  const tunjanganOptions = ["Uang Makan", "Transport", "Lembur"];
  const jasaOptions = ["Instalasi", "Maintenance", "Konsultasi"];
  const alatOptions = ["Crane", "Forklift", "Truck", "Komputer"];
  const barangOptions = ["Kabel NYA", "Panel", "Pipa", "Baut"];
  const ppeOptions = [
    "Safety Helmet",
    "Safety Boots",
    "Safety Gloves",
    "Safety Goggles",
    "Coverall",
  ];
  const jenisPekerjaanUnitPrice: Record<string, number> = {
    "On Call": 1500000,
    "Project Based": 2500000,
    Maintenance: 1000000,
    Consulting: 2000000,
  };

  const updateRow = (
    setter: any,
    index: number,
    field: string,
    value: string
  ) => {
    setter((prev: any[]) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const addRow = (setter: any, empty: any) =>
    setter((prev: any[]) => [...prev, empty]);
  const removeRow = (setter: any, data: any[]) => {
    if (data.length === 1) return;
    setter((prev: any[]) => prev.slice(0, -1));
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

  // Preload data when opening in read-only or edit mode
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        tanggalDibuat: initialData.tanggalDibuat || prev.tanggalDibuat,
      }));
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SOTurunanFormData> = {};

    if (!formData.soInduk.trim()) {
      newErrors.soInduk = "SO Induk wajib dipilih";
    }

    if (!formData.soTurunan.trim()) {
      newErrors.soTurunan = "SO Turunan wajib diisi";
    }

    if (!formData.nomorKontrak.trim()) {
      newErrors.nomorKontrak = "Nomor Kontrak wajib diisi";
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = "Nama Proyek wajib diisi";
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = "Nama Client wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SOTurunanFormData, value: string) => {
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

    onSave(formData);
    setIsLoading(false);

    // Reset form
    setFormData({
      soInduk: "",
      soTurunan: "",
      nomorKontrak: "",
      namaProyek: "",
      namaClient: "",
      tanggalDibuat: new Date().toISOString().split("T")[0],
      jenisPekerjaan: "",
      tanggalMOB: "",
      tanggalDemob: "",
      estimasiSO: "",
      keterangan: "",
    });
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Ringkasan pekerjaan handlers
  const addPekerjaanRow = () => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      pekerjaanRingkas: [
        ...(prev.pekerjaanRingkas || []),
        { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
      ],
    }));
  };
  const updatePekerjaanRow = (
    idx: number,
    field: "jenisPekerjaan" | "jumlah",
    value: string
  ) => {
    setFormData((prev) => {
      const rows = [...(prev.pekerjaanRingkas || [])];
      let row = { ...rows[idx], [field]: value } as {
        jenisPekerjaan: string;
        hargaSatuan: string;
        jumlah: string;
        total: string;
      };

      if (field === "jenisPekerjaan") {
        const unit = jenisPekerjaanUnitPrice[value] || 0;
        row.hargaSatuan = unit ? String(unit) : "";
      }
      const jumlahNum =
        parseFloat(field === "jumlah" ? value : row.jumlah || "0") || 0;
      const hargaNum = parseFloat(row.hargaSatuan || "0") || 0;
      row.total =
        jumlahNum > 0 && hargaNum > 0
          ? String(jumlahNum * hargaNum)
          : row.total || "";
      rows[idx] = row;

      // Auto-fill ALL rows in Tenaga Kerja & Barang + append 2 rows each
      if (field === "jenisPekerjaan") {
        const unit = jenisPekerjaanUnitPrice[value] || 0;
        if (unit > 0) {
          // Tenaga Kerja: fill existing
          const filledTK = tenagaKerja.map((r, i) => {
            const projectRate = unit;
            const hari = 1;
            const hargaAwal = projectRate * hari;
            const margin = 10;
            const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
            return {
              pegawai:
                pegawaiOptions[i % pegawaiOptions.length] || r.pegawai || "",
              tenaga: tenagaOptions[i % tenagaOptions.length] || r.tenaga || "",
              tunjangan:
                tunjanganOptions[i % tunjanganOptions.length] ||
                r.tunjangan ||
                "",
              projectRate: String(projectRate),
              hari: String(hari),
              unit: r.unit || "Hari",
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          });
          const mkTK = (seed: number) => {
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
              unit: "Hari",
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          };
          setTenagaKerja([
            ...filledTK,
            mkTK(filledTK.length),
            mkTK(filledTK.length + 1),
          ]);

          // Barang: fill existing
          const filledBRG = barang.map((r, i) => {
            const jumlah = 1;
            const harga = unit;
            const hargaSatuan = jumlah > 0 ? harga / jumlah : 0;
            const margin = 10;
            const hargaAkhir = harga + (harga * margin) / 100;
            return {
              namaBarang:
                barangOptions[i % barangOptions.length] || r.namaBarang || "",
              jumlah: String(jumlah),
              hari: r.hari || "1",
              satuan: r.satuan || "Unit",
              hargaSatuan: String(hargaSatuan),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          });
          const mkBRG = (seed: number) => {
            const jumlah = 1;
            const harga = unit;
            const hargaSatuan = jumlah > 0 ? harga / jumlah : 0;
            const margin = 10;
            const hargaAkhir = harga + (harga * margin) / 100;
            return {
              namaBarang: barangOptions[seed % barangOptions.length] || "",
              jumlah: String(jumlah),
              hari: "1",
              satuan: "Unit",
              hargaSatuan: String(hargaSatuan),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          };
          setBarang([
            ...filledBRG,
            mkBRG(filledBRG.length),
            mkBRG(filledBRG.length + 1),
          ]);
        }
      }

      return { ...prev, pekerjaanRingkas: rows };
    });
  };
  const removePekerjaanRow = (idx: number) => {
    if (readOnly) return;
    setFormData((prev) => {
      const rows = prev.pekerjaanRingkas || [];
      if (rows.length <= 1) return prev;
      return { ...prev, pekerjaanRingkas: rows.filter((_, i) => i !== idx) };
    });
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
            {readOnly
              ? "Detail SO Turunan"
              : isProcess
              ? "Proses SO Turunan"
              : "Entry SO Turunan"}
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
              {/* SO Induk */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SO Induk <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.soInduk}
                  onChange={(e) => handleInputChange("soInduk", e.target.value)}
                  disabled={readOnly}
                  className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.soInduk
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih SO Induk</option>
                  {soIndukOptions.map((so) => (
                    <option key={so} value={so}>
                      {so}
                    </option>
                  ))}
                </select>
                {errors.soInduk && (
                  <p className="mt-1 text-sm text-red-600">{errors.soInduk}</p>
                )}
              </div>

              {/* Metode Pengerjaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Metode Pengerjaan
                </label>
                <select
                  value={formData.jenisPekerjaan}
                  onChange={(e) =>
                    handleInputChange("jenisPekerjaan", e.target.value)
                  }
                  disabled={readOnly}
                  className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Pilih Metode Pengerjaan</option>
                  {jenisPekerjaanOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
                </select>
              </div>

              {/* SO Turunan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SO Turunan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.soTurunan}
                  onChange={(e) =>
                    handleInputChange("soTurunan", e.target.value)
                  }
                  disabled={readOnly || isProcess}
                  className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.soTurunan
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Masukkan SO Turunan"
                />
                {errors.soTurunan && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.soTurunan}
                  </p>
                )}
              </div>

              {/* Tanggal MOB */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Tanggal MOB
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalMOB}
                    onChange={(e) =>
                      handleInputChange("tanggalMOB", e.target.value)
                    }
                    disabled={readOnly}
                    className="w-full px-2 py-2 pr-8 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nomor Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Nomor Kontrak <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nomorKontrak}
                  onChange={(e) =>
                    handleInputChange("nomorKontrak", e.target.value)
                  }
                  disabled={readOnly || isProcess}
                  className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nomorKontrak
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Masukkan nomor kontrak"
                />
                {errors.nomorKontrak && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nomorKontrak}
                  </p>
                )}
              </div>

              {/* Tanggal Demob */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Tanggal Demob
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalDemob}
                    onChange={(e) =>
                      handleInputChange("tanggalDemob", e.target.value)
                    }
                    disabled={readOnly}
                    className="w-full px-2 py-2 pr-8 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaProyek}
                  onChange={(e) =>
                    handleInputChange("namaProyek", e.target.value)
                  }
                  disabled={readOnly || isProcess}
                  className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaProyek
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Masukkan nama proyek"
                />
                {errors.namaProyek && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.namaProyek}
                  </p>
                )}
              </div>

              {/* Estimasi SO Turunan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Estimasi SO Turunan
                </label>
                <input
                  type="text"
                  value={formData.estimasiSO}
                  onChange={(e) =>
                    handleInputChange("estimasiSO", e.target.value)
                  }
                  disabled={readOnly}
                  className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 0"
                />
              </div>

              {/* Nama Client */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) =>
                    handleInputChange("namaClient", e.target.value)
                  }
                  disabled={readOnly || isProcess}
                  className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
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
                  <p className="mt-1 text-sm text-red-600">
                    {errors.namaClient}
                  </p>
                )}
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) =>
                    handleInputChange("keterangan", e.target.value)
                  }
                  disabled={readOnly}
                  rows={3}
                  className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan keterangan..."
                />
              </div>

              {/* Ringkasan Metode Pengerjaan vs Jumlah */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-900">
                    Metode Pengerjaan
                  </h4>
                  {!readOnly && !isProcess && (
                    <button
                      type="button"
                      onClick={addPekerjaanRow}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Tambah
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Metode Pengerjaan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(formData.pekerjaanRingkas || []).map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">
                            <select
                              value={row.jenisPekerjaan}
                              onChange={(e) =>
                                updatePekerjaanRow(
                                  idx,
                                  "jenisPekerjaan",
                                  e.target.value
                                )
                              }
                              disabled={readOnly}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="">Pilih Metode Pengerjaan</option>
                              {jenisPekerjaanOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              value={row.jumlah}
                              onChange={(e) =>
                                updatePekerjaanRow(
                                  idx,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              disabled={readOnly}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            {!readOnly && !isProcess && (
                              <button
                                type="button"
                                onClick={() => removePekerjaanRow(idx)}
                                disabled={
                                  (formData.pekerjaanRingkas || []).length === 1
                                }
                                className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tabs Detail (mengikuti Sales Order) */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t-md ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tenaga Kerja */}
              {activeTab === "Tenaga Kerja" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">Pegawai</th>
                        <th className="px-2 py-2 text-left">Tenaga</th>
                        <th className="px-2 py-2 text-left">Tunjangan</th>
                        <th className="px-2 py-2 text-left">Project Rate</th>
                        <th className="px-2 py-2 text-left">Jumlah</th>
                        <th className="px-2 py-2 text-left">Satuan</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        <th className="px-2 py-2 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenagaKerja.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.pegawai}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "pegawai",
                                  e.target.value
                                )
                              }
                              list={`pegawaiOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`pegawaiOptions-${idx}`}>
                              {pegawaiOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.tenaga}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "tenaga",
                                  e.target.value
                                )
                              }
                              list={`tenagaOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`tenagaOptions-${idx}`}>
                              {tenagaOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.tunjangan}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "tunjangan",
                                  e.target.value
                                )
                              }
                              list={`tunjanganOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`tunjanganOptions-${idx}`}>
                              {tunjanganOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.projectRate}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "projectRate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "hari",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.unit}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "unit",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          {!readOnly && !isProcess && (
                            <td className="px-2 py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  removeRow(setTenagaKerja, tenagaKerja)
                                }
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setTenagaKerja, {
                            pegawai: "",
                            tenaga: "",
                            tunjangan: "",
                            projectRate: "",
                            hari: "",
                            unit: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PPE */}
              {activeTab === "PPE" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">
                          Nama Barang (PPE)
                        </th>
                        <th className="px-2 py-2 text-left">Jumlah</th>
                        <th className="px-2 py-2 text-left">Jumlah</th>
                        <th className="px-2 py-2 text-left">Satuan</th>
                        <th className="px-2 py-2 text-left">Harga Satuan</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        {!readOnly && !isProcess && (
                          <th className="px-2 py-2 text-left">Aksi</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {ppe.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.namaBarang}
                              onChange={(e) =>
                                updateRow(
                                  setPpe,
                                  idx,
                                  "namaBarang",
                                  e.target.value
                                )
                              }
                              list={`ppeOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`ppeOptions-${idx}`}>
                              {ppeOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.jumlah}
                              onChange={(e) =>
                                updateRow(setPpe, idx, "jumlah", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(setPpe, idx, "hari", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.satuan}
                              onChange={(e) =>
                                updateRow(setPpe, idx, "satuan", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaSatuan}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(setPpe, idx, "margin", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {!isProcess && !readOnly && (
                              <button
                                type="button"
                                onClick={() => removeRow(setPpe, ppe)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setPpe, {
                            namaBarang: "",
                            jumlah: "",
                            hari: "",
                            satuan: "",
                            hargaSatuan: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Jasa */}
              {activeTab === "Jasa" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">Jasa</th>
                        <th className="px-2 py-2 text-left">Tunjangan</th>
                        <th className="px-2 py-2 text-left">Project Rate</th>
                        <th className="px-2 py-2 text-left">Jumlah</th>
                        <th className="px-2 py-2 text-left">Satuan</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        {!readOnly && !isProcess && (
                          <th className="px-2 py-2 text-left">Aksi</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {jasa.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.jasa}
                              onChange={(e) =>
                                updateRow(setJasa, idx, "jasa", e.target.value)
                              }
                              list={`jasaOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`jasaOptions-${idx}`}>
                              {jasaOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.tunjangan}
                              onChange={(e) =>
                                updateRow(
                                  setJasa,
                                  idx,
                                  "tunjangan",
                                  e.target.value
                                )
                              }
                              list={`tunjanganJasaOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`tunjanganJasaOptions-${idx}`}>
                              {tunjanganOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.projectRate}
                              onChange={(e) =>
                                updateRow(
                                  setJasa,
                                  idx,
                                  "projectRate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(setJasa, idx, "hari", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.unit}
                              onChange={(e) =>
                                updateRow(setJasa, idx, "unit", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(
                                  setJasa,
                                  idx,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {!isProcess && !readOnly && (
                              <button
                                type="button"
                                onClick={() => removeRow(setJasa, jasa)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setJasa, {
                            jasa: "",
                            tunjangan: "",
                            projectRate: "",
                            hari: "",
                            unit: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Alat */}
              {activeTab === "Alat" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">Alat</th>
                        <th className="px-2 py-2 text-left">Jumlah</th>
                        <th className="px-2 py-2 text-left">Hari</th>
                        <th className="px-2 py-2 text-left">Satuan</th>
                        <th className="px-2 py-2 text-left">Harga Satuan</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        <th className="px-2 py-2 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alat.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.alat}
                              onChange={(e) =>
                                updateRow(setAlat, idx, "alat", e.target.value)
                              }
                              list={`alatOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`alatOptions-${idx}`}>
                              {alatOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.jumlah}
                              onChange={(e) =>
                                updateRow(
                                  setAlat,
                                  idx,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(setAlat, idx, "hari", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.satuan}
                              onChange={(e) =>
                                updateRow(
                                  setAlat,
                                  idx,
                                  "satuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaSatuan}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(
                                  setAlat,
                                  idx,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {!isProcess && !readOnly && (
                              <button
                                type="button"
                                onClick={() => removeRow(setAlat, alat)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setAlat, {
                            alat: "",
                            jumlah: "",
                            hari: "",
                            satuan: "",
                            hargaSatuan: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Barang & Consumeble */}
              {activeTab === "Barang & Consumeble" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">Nama Barang</th>
                        <th className="px-2 py-2 text-left">Jumlah</th>
                        <th className="px-2 py-2 text-left">Hari</th>
                        <th className="px-2 py-2 text-left">Satuan</th>
                        <th className="px-2 py-2 text-left">Harga Satuan</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        <th className="px-2 py-2 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barang.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.namaBarang}
                              onChange={(e) =>
                                updateRow(
                                  setBarang,
                                  idx,
                                  "namaBarang",
                                  e.target.value
                                )
                              }
                              list={`barangOptions-${idx}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                            <datalist id={`barangOptions-${idx}`}>
                              {barangOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.jumlah}
                              onChange={(e) =>
                                updateRow(
                                  setBarang,
                                  idx,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(
                                  setBarang,
                                  idx,
                                  "hari",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.satuan}
                              onChange={(e) =>
                                updateRow(
                                  setBarang,
                                  idx,
                                  "satuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaSatuan}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(
                                  setBarang,
                                  idx,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {!isProcess && !readOnly && (
                              <button
                                type="button"
                                onClick={() => removeRow(setBarang, barang)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setBarang, {
                            namaBarang: "",
                            jumlah: "",
                            hari: "",
                            satuan: "",
                            hargaSatuan: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MobDemob */}
              {activeTab === "MobDemob" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">
                          Nama Transportasi
                        </th>
                        <th className="px-2 py-2 text-left">Tunjangan</th>
                        <th className="px-2 py-2 text-left">Project Rate</th>
                        <th className="px-2 py-2 text-left">Hari</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        <th className="px-2 py-2 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mobDemob.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.namaTransportasi}
                              onChange={(e) =>
                                updateRow(
                                  setMobDemob,
                                  idx,
                                  "namaTransportasi",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.tunjangan}
                              onChange={(e) =>
                                updateRow(
                                  setMobDemob,
                                  idx,
                                  "tunjangan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.projectRate}
                              onChange={(e) =>
                                updateRow(
                                  setMobDemob,
                                  idx,
                                  "projectRate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(
                                  setMobDemob,
                                  idx,
                                  "hari",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.satuan}
                              onChange={(e) =>
                                updateRow(
                                  setMobDemob,
                                  idx,
                                  "satuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(
                                  setMobDemob,
                                  idx,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {!isProcess && !readOnly && (
                              <button
                                type="button"
                                onClick={() => removeRow(setMobDemob, mobDemob)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setMobDemob, {
                            namaTransportasi: "",
                            tunjangan: "",
                            projectRate: "",
                            hari: "",
                            satuan: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Biaya Lain-lain */}
              {activeTab === "Biaya Lain-lain" && (
                <div className="mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left">Nama Biaya</th>
                        <th className="px-2 py-2 text-left">Tunjangan</th>
                        <th className="px-2 py-2 text-left">Project Rate</th>
                        <th className="px-2 py-2 text-left">Hari</th>
                        <th className="px-2 py-2 text-left">Margin</th>
                        <th className="px-2 py-2 text-left">Harga Akhir</th>
                        <th className="px-2 py-2 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {biayaLainLain.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2">
                            <input
                              value={row.namaBiaya}
                              onChange={(e) =>
                                updateRow(
                                  setBiayaLainLain,
                                  idx,
                                  "namaBiaya",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.tunjangan}
                              onChange={(e) =>
                                updateRow(
                                  setBiayaLainLain,
                                  idx,
                                  "tunjangan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.projectRate}
                              onChange={(e) =>
                                updateRow(
                                  setBiayaLainLain,
                                  idx,
                                  "projectRate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hari}
                              onChange={(e) =>
                                updateRow(
                                  setBiayaLainLain,
                                  idx,
                                  "hari",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={row.satuan}
                              onChange={(e) =>
                                updateRow(
                                  setBiayaLainLain,
                                  idx,
                                  "satuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Unit">Unit</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.margin}
                              onChange={(e) =>
                                updateRow(
                                  setBiayaLainLain,
                                  idx,
                                  "margin",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              value={row.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {!isProcess && !readOnly && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeRow(setBiayaLainLain, biayaLainLain)
                                }
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!isProcess && !readOnly && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addRow(setBiayaLainLain, {
                            namaBiaya: "",
                            tunjangan: "",
                            projectRate: "",
                            hari: "",
                            satuan: "",
                            margin: "",
                            hargaAkhir: "",
                          })
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Baris
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-xs"
          >
            Close
          </button>
          {!readOnly && isProcess && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    <span>Approve</span>
                  </>
                )}
              </button>
            </>
          )}
          {!readOnly && !isProcess && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  <span>Save changes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOTurunanModal;
