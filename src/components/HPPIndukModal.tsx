import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Plus, Trash2 } from "lucide-react";

interface HPPIndukModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HPPIndukFormData) => void;
}

export interface HPPIndukFormData {
  noKontrak: string;
  durasiKontrak: string;
  namaClient: string;
  lokasiPekerjaan: string;
  namaProject: string;
  jenisPekerjaan: string;
  estimasiNilaiKontrak: string;
  sertifikat: File | null;
  pekerjaanRingkas: Array<{
    jenisPekerjaan: string;
    hargaSatuan: string;
    jumlah: string;
    total: string;
  }>;
  activeTab: string;
  tenagaKerja: Array<{
    tenaga: string;
    tunjangan: string;
    projectRate: string;
    jumlah: string;
    satuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  jasa: Array<{
    jasa: string;
    tunjangan: string;
    projectRate: string;
    jumlah: string;
    satuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  alat: Array<{
    alat: string;
    harga: string;
    jumlah: string;
    hari: string;
    satuan: string;
    hargaSatuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  barang: Array<{
    namaBarang: string;
    harga: string;
    jumlah: string;
    hari: string;
    satuan: string;
    hargaSatuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  ppe: Array<{
    namaBarang: string;
    harga: string;
    jumlah: string;
    hari: string;
    satuan: string;
    hargaSatuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  mobDemob: Array<{
    namaTransportasi: string;
    tunjangan: string;
    projectRate: string;
    jumlah: string;
    satuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  biayaLainLain: Array<{
    namaBiaya: string;
    tunjangan: string;
    projectRate: string;
    jumlah: string;
    satuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
}

const HPPIndukModal: React.FC<HPPIndukModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<HPPIndukFormData>({
    noKontrak: "",
    durasiKontrak: "",
    namaClient: "",
    lokasiPekerjaan: "",
    namaProject: "",
    jenisPekerjaan: "On Call",
    estimasiNilaiKontrak: "",
    sertifikat: null,
    pekerjaanRingkas: [
      { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
    ],
    activeTab: "Tenaga Kerja",
    tenagaKerja: [
      {
        tenaga: "",
        tunjangan: "",
        projectRate: "",
        jumlah: "",
        satuan: "Hari",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ],
    jasa: [
      {
        jasa: "",
        tunjangan: "",
        projectRate: "",
        jumlah: "",
        satuan: "Hari",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ],
    alat: [
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
    ],
    barang: [
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
    ],
    ppe: [
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
    ],
    mobDemob: [
      {
        namaTransportasi: "",
        tunjangan: "",
        projectRate: "",
        jumlah: "",
        satuan: "Hari",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ],
    biayaLainLain: [
      {
        namaBiaya: "",
        tunjangan: "",
        projectRate: "",
        jumlah: "",
        satuan: "Hari",
        hargaAwal: "",
        margin: "",
        hargaAkhir: "",
      },
    ],
  });

  const [errors, setErrors] = useState<Partial<HPPIndukFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = [
    "Client A",
    "PT Teknologi Maju",
    "CV Digital Solutions",
    "PT Industri Kreatif",
    "UD Berkah Jaya",
    "PT Global Mandiri",
  ];

  const jenisPekerjaanOptions = [
    "On Call",
    "Project Based",
    "Maintenance",
    "Consulting",
  ];
  const jenisPekerjaanUnitPrice: Record<string, number> = {
    "On Call": 1500000,
    "Project Based": 2500000,
    Maintenance: 1000000,
    Consulting: 2000000,
  };
  const tenagaOptions = ["Teknisi", "Supervisor", "Engineer", "Admin"];
  const satuanOptions = ["Hari", "Unit"];
  const tunjanganOptions = ["Uang Makan", "Transport", "Lembur"];
  const jasaOptions = ["Instalasi", "Maintenance", "Konsultasi", "Pelatihan"];
  const alatOptions = ["Excavator", "Crane", "Forklift", "Generator"];
  const barangOptions = ["Cable", "Pipe", "Bolt", "Panel"];
  const ppeOptions = [
    "Safety Helmet",
    "Safety Boots",
    "Safety Gloves",
    "Safety Goggles",
  ];

  const tabs = [
    "Tenaga Kerja",
    "Jasa",
    "Alat",
    "Barang & Consumeble",
    "PPE",
    "MobDemob",
    "Biaya Lain-lain",
    "Sisa HPP",
  ];

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

  // Handlers for pekerjaanRingkas (summary table below Estimasi Nilai Kontrak)
  const addPekerjaanRow = () => {
    setFormData((prev) => ({
      ...prev,
      pekerjaanRingkas: [
        ...prev.pekerjaanRingkas,
        { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
      ],
    }));
  };

  const updatePekerjaanRow = (
    index: number,
    field: "jenisPekerjaan" | "jumlah",
    value: string
  ) => {
    setFormData((prev) => {
      const next = [...prev.pekerjaanRingkas];
      let row = { ...next[index], [field]: value } as (typeof next)[number];

      // When jenis pekerjaan changes, set hargaSatuan automatically
      if (field === "jenisPekerjaan") {
        const unit = jenisPekerjaanUnitPrice[value] || 0;
        row.hargaSatuan = unit ? String(unit) : "";
      }

      // Recalculate total whenever jumlah or hargaSatuan is available
      const jumlahNum =
        parseFloat(field === "jumlah" ? value : row.jumlah || "0") || 0;
      const hargaNum = parseFloat(row.hargaSatuan || "0") || 0;
      if (jumlahNum > 0 && hargaNum > 0) {
        row.total = String(jumlahNum * hargaNum);
      } else {
        row.total = row.total || "";
      }

      next[index] = row;

      // When selecting jenis pekerjaan in Ringkasan, auto-fill ALL rows in Tenaga Kerja & Barang tabs
      if (field === "jenisPekerjaan") {
        const unit = jenisPekerjaanUnitPrice[value] || 0;
        if (unit > 0) {
          const filledTenagaKerja = prev.tenagaKerja.map((rowTK, idx) => {
            const projectRate = unit;
            const jumlah = 1;
            const hargaAwal = projectRate * jumlah;
            const margin = 10; // default margin 10%
            const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
            return {
              tenaga:
                tenagaOptions[idx % tenagaOptions.length] || rowTK.tenaga || "",
              tunjangan:
                tunjanganOptions[idx % tunjanganOptions.length] ||
                rowTK.tunjangan ||
                "",
              projectRate: String(projectRate),
              jumlah: String(jumlah),
              satuan: rowTK.satuan || "Hari",
              hargaAwal: String(hargaAwal),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          });
          // Also fill Barang tab rows
          const filledBarang = prev.barang.map((rowBRG, idx) => {
            const jumlah = 1;
            const hari = "";
            const harga = unit;
            const hargaSatuan = jumlah > 0 ? harga / jumlah : 0;
            const margin = 10;
            const hargaAwal = String(harga); // treat harga as hargaAwal basis
            const hargaAkhir = harga + (harga * margin) / 100;
            return {
              namaBarang:
                barangOptions[idx % barangOptions.length] ||
                rowBRG.namaBarang ||
                "",
              harga: String(harga),
              jumlah: String(jumlah),
              hari: String(hari),
              satuan: rowBRG.satuan || "Unit",
              hargaSatuan: String(hargaSatuan),
              hargaAwal: String(harga),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          });
          // Also append 2 new prefilled rows
          const mkRow = (seedIdx: number) => {
            const projectRate = unit;
            const jumlah = 1;
            const hargaAwal = projectRate * jumlah;
            const margin = 10;
            const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
            return {
              tenaga: tenagaOptions[seedIdx % tenagaOptions.length] || "",
              tunjangan:
                tunjanganOptions[seedIdx % tunjanganOptions.length] || "",
              projectRate: String(projectRate),
              jumlah: String(jumlah),
              satuan: "Hari",
              hargaAwal: String(hargaAwal),
              margin: String(margin),
              hargaAkhir: String(hargaAkhir),
            };
          };
          const appendedTK = [
            ...filledTenagaKerja,
            mkRow(filledTenagaKerja.length),
            mkRow(filledTenagaKerja.length + 1),
          ];

          const mkBarangRow = (seedIdx: number) => {
            const jumlah = 1;
            const harga = unit;
            const hargaSatuan = jumlah > 0 ? harga / jumlah : 0;
            const margin = 10;
            const hargaAkhir = harga + (harga * margin) / 100;
            return {
              namaBarang: barangOptions[seedIdx % barangOptions.length] || "",
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
          const appendedBRG = [
            ...filledBarang,
            mkBarangRow(filledBarang.length),
            mkBarangRow(filledBarang.length + 1),
          ];

          return {
            ...prev,
            pekerjaanRingkas: next,
            tenagaKerja: appendedTK,
            barang: appendedBRG,
          };
        }
      }
      return { ...prev, pekerjaanRingkas: next };
    });
  };

  const removePekerjaanRow = (index: number) => {
    setFormData((prev) => {
      if (prev.pekerjaanRingkas.length === 1) return prev;
      return {
        ...prev,
        pekerjaanRingkas: prev.pekerjaanRingkas.filter((_, i) => i !== index),
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<HPPIndukFormData> = {};

    if (!formData.noKontrak.trim()) {
      newErrors.noKontrak = "No Kontrak wajib diisi";
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = "Nama Client wajib diisi";
    }

    if (!formData.namaProject.trim()) {
      newErrors.namaProject = "Nama Project wajib diisi";
    }

    if (!formData.lokasiPekerjaan.trim()) {
      newErrors.lokasiPekerjaan = "Lokasi Pekerjaan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof HPPIndukFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, sertifikat: file }));
  };

  const getCurrentTabData = () => {
    switch (formData.activeTab) {
      case "Tenaga Kerja":
        return formData.tenagaKerja;
      case "Jasa":
        return formData.jasa;
      case "Alat":
        return formData.alat;
      case "Barang & Consumeble":
        return formData.barang;
      case "PPE":
        return formData.ppe;
      case "MobDemob":
        return formData.mobDemob;
      case "Biaya Lain-lain":
        return formData.biayaLainLain;
      default:
        return [];
    }
  };

  const handleTabDataChange = (index: number, field: string, value: string) => {
    const currentTab = formData.activeTab;
    let newData: any[] = [];

    switch (currentTab) {
      case "Tenaga Kerja":
        newData = [...formData.tenagaKerja];
        break;
      case "Jasa":
        newData = [...formData.jasa];
        break;
      case "Alat":
        newData = [...formData.alat];
        break;
      case "Barang & Consumeble":
        newData = [...formData.barang];
        break;
      case "PPE":
        newData = [...formData.ppe];
        break;
      case "MobDemob":
        newData = [...formData.mobDemob];
        break;
      case "Biaya Lain-lain":
        newData = [...formData.biayaLainLain];
        break;
      default:
        return;
    }

    newData[index] = { ...newData[index], [field]: value };

    // Auto calculate harga akhir if margin and harga awal are provided
    if (field === "margin" || field === "hargaAwal") {
      const hargaAwal =
        parseFloat(field === "hargaAwal" ? value : newData[index].hargaAwal) ||
        0;
      const margin =
        parseFloat(field === "margin" ? value : newData[index].margin) || 0;
      const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
      newData[index].hargaAkhir = hargaAkhir.toString();
    }

    // Auto calculate harga satuan for Alat, Barang & Consumeble, and PPE tabs
    if (
      (currentTab === "Alat" ||
        currentTab === "Barang & Consumeble" ||
        currentTab === "PPE") &&
      (field === "harga" || field === "jumlah")
    ) {
      const harga =
        parseFloat(field === "harga" ? value : newData[index].harga) || 0;
      const jumlah =
        parseFloat(field === "jumlah" ? value : newData[index].jumlah) || 0;
      if (jumlah > 0) {
        newData[index].hargaSatuan = (harga / jumlah).toString();
      }
    }

    switch (currentTab) {
      case "Tenaga Kerja":
        setFormData((prev) => ({ ...prev, tenagaKerja: newData }));
        break;
      case "Jasa":
        setFormData((prev) => ({ ...prev, jasa: newData }));
        break;
      case "Alat":
        setFormData((prev) => ({ ...prev, alat: newData }));
        break;
      case "Barang & Consumeble":
        setFormData((prev) => ({ ...prev, barang: newData }));
        break;
      case "PPE":
        setFormData((prev) => ({ ...prev, ppe: newData }));
        break;
      case "MobDemob":
        setFormData((prev) => ({ ...prev, mobDemob: newData }));
        break;
      case "Biaya Lain-lain":
        setFormData((prev) => ({ ...prev, biayaLainLain: newData }));
        break;
    }
  };

  const addTabData = () => {
    const currentTab = formData.activeTab;

    switch (currentTab) {
      case "Tenaga Kerja":
        setFormData((prev) => ({
          ...prev,
          tenagaKerja: [
            ...prev.tenagaKerja,
            {
              tenaga: "",
              tunjangan: "",
              projectRate: "",
              jumlah: "",
              satuan: "Hari",
              hargaAwal: "",
              margin: "",
              hargaAkhir: "",
            },
          ],
        }));
        break;
      case "Jasa":
        setFormData((prev) => ({
          ...prev,
          jasa: [
            ...prev.jasa,
            {
              jasa: "",
              tunjangan: "",
              projectRate: "",
              jumlah: "",
              satuan: "Hari",
              hargaAwal: "",
              margin: "",
              hargaAkhir: "",
            },
          ],
        }));
        break;
      case "Alat":
        setFormData((prev) => ({
          ...prev,
          alat: [
            ...prev.alat,
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
          ],
        }));
        break;
      case "Barang & Consumeble":
        setFormData((prev) => ({
          ...prev,
          barang: [
            ...prev.barang,
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
          ],
        }));
        break;
      case "PPE":
        setFormData((prev) => ({
          ...prev,
          ppe: [
            ...prev.ppe,
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
          ],
        }));
        break;
      case "MobDemob":
        setFormData((prev) => ({
          ...prev,
          mobDemob: [
            ...prev.mobDemob,
            {
              namaTransportasi: "",
              tunjangan: "",
              projectRate: "",
              jumlah: "",
              satuan: "Hari",
              hargaAwal: "",
              margin: "",
              hargaAkhir: "",
            },
          ],
        }));
        break;
      case "Biaya Lain-lain":
        setFormData((prev) => ({
          ...prev,
          biayaLainLain: [
            ...prev.biayaLainLain,
            {
              namaBiaya: "",
              tunjangan: "",
              projectRate: "",
              jumlah: "",
              satuan: "Hari",
              hargaAwal: "",
              margin: "",
              hargaAkhir: "",
            },
          ],
        }));
        break;
    }
  };

  const removeTabData = (index: number) => {
    const currentTab = formData.activeTab;
    const currentData = getCurrentTabData();

    if (currentData.length > 1) {
      switch (currentTab) {
        case "Tenaga Kerja":
          setFormData((prev) => ({
            ...prev,
            tenagaKerja: prev.tenagaKerja.filter((_, i) => i !== index),
          }));
          break;
        case "Jasa":
          setFormData((prev) => ({
            ...prev,
            jasa: prev.jasa.filter((_, i) => i !== index),
          }));
          break;
        case "Alat":
          setFormData((prev) => ({
            ...prev,
            alat: prev.alat.filter((_, i) => i !== index),
          }));
          break;
        case "Barang & Consumeble":
          setFormData((prev) => ({
            ...prev,
            barang: prev.barang.filter((_, i) => i !== index),
          }));
          break;
        case "PPE":
          setFormData((prev) => ({
            ...prev,
            ppe: prev.ppe.filter((_, i) => i !== index),
          }));
          break;
        case "MobDemob":
          setFormData((prev) => ({
            ...prev,
            mobDemob: prev.mobDemob.filter((_, i) => i !== index),
          }));
          break;
        case "Biaya Lain-lain":
          setFormData((prev) => ({
            ...prev,
            biayaLainLain: prev.biayaLainLain.filter((_, i) => i !== index),
          }));
          break;
      }
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
      noKontrak: "",
      durasiKontrak: "",
      namaClient: "",
      lokasiPekerjaan: "",
      namaProject: "",
      jenisPekerjaan: "On Call",
      estimasiNilaiKontrak: "",
      sertifikat: null,
      pekerjaanRingkas: [
        { jenisPekerjaan: "", hargaSatuan: "", jumlah: "", total: "" },
      ],
      activeTab: "Tenaga Kerja",
      tenagaKerja: [
        {
          tenaga: "",
          tunjangan: "",
          projectRate: "",
          jumlah: "",
          satuan: "Hari",
          hargaAwal: "",
          margin: "",
          hargaAkhir: "",
        },
      ],
      jasa: [
        {
          jasa: "",
          tunjangan: "",
          projectRate: "",
          jumlah: "",
          satuan: "Hari",
          hargaAwal: "",
          margin: "",
          hargaAkhir: "",
        },
      ],
      alat: [
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
      ],
      barang: [
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
      ],
      ppe: [
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
      ],
      mobDemob: [
        {
          namaTransportasi: "",
          tunjangan: "",
          projectRate: "",
          jumlah: "",
          satuan: "Hari",
          hargaAwal: "",
          margin: "",
          hargaAkhir: "",
        },
      ],
      biayaLainLain: [
        {
          namaBiaya: "",
          tunjangan: "",
          projectRate: "",
          jumlah: "",
          satuan: "Hari",
          hargaAwal: "",
          margin: "",
          hargaAkhir: "",
        },
      ],
    });
    setErrors({});
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-bold text-gray-900">Entry HPP Induk</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              {/* No Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No Kontrak <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noKontrak}
                  onChange={(e) =>
                    handleInputChange("noKontrak", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.noKontrak
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih No Kontrak</option>
                  <option value="KTR-2025-001">KTR-2025-001</option>
                  <option value="KTR-2025-002">KTR-2025-002</option>
                  <option value="KTR-2025-003">KTR-2025-003</option>
                </select>
                {errors.noKontrak && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.noKontrak}
                  </p>
                )}
              </div>

              {/* Durasi Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Durasi Kontrak
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={formData.durasiKontrak.split(" s.d ")[0] || ""}
                    onChange={(e) => {
                      const endDate =
                        formData.durasiKontrak.split(" s.d ")[1] || "";
                      handleInputChange(
                        "durasiKontrak",
                        `${e.target.value}${endDate ? ` s.d ${endDate}` : ""}`
                      );
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  />
                  <span className="text-gray-500 text-xs">s.d</span>
                  <input
                    type="date"
                    value={formData.durasiKontrak.split(" s.d ")[1] || ""}
                    onChange={(e) => {
                      const startDate =
                        formData.durasiKontrak.split(" s.d ")[0] || "";
                      handleInputChange(
                        "durasiKontrak",
                        `${startDate} s.d ${e.target.value}`
                      );
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  />
                </div>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
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

              {/* Lokasi Pekerjaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lokasi Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lokasiPekerjaan}
                  onChange={(e) =>
                    handleInputChange("lokasiPekerjaan", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.lokasiPekerjaan
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Jl. Perintis Kemerdekaan, Jakarta"
                />
                {errors.lokasiPekerjaan && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lokasiPekerjaan}
                  </p>
                )}
              </div>

              {/* Nama Project */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaProject}
                  onChange={(e) =>
                    handleInputChange("namaProject", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.namaProject
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Masukkan nama project"
                />
                {errors.namaProject && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.namaProject}
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
                    handleInputChange("jenisPekerjaan", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                >
                  {jenisPekerjaanOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimasi Nilai Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Estimasi Nilai Kontrak
                </label>
                <input
                  type="text"
                  value={formData.estimasiNilaiKontrak}
                  onChange={(e) =>
                    handleInputChange("estimasiNilaiKontrak", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Rp 0"
                />
              </div>

              {/* Upload Sertifikat */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Upload Sertifikat
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.sertifikat && (
                  <p className="mt-1 text-xs text-gray-600 truncate">
                    File terpilih: {formData.sertifikat.name}
                  </p>
                )}
              </div>

              {/* Ringkasan Jenis Pekerjaan vs Jumlah */}
              <div className="lg:col-span-2 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-900">
                    Ringkasan Pekerjaan
                  </h4>
                  <button
                    type="button"
                    onClick={addPekerjaanRow}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    <Plus className="h-3 w-3" /> Tambah
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Metode Pengerjaan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Total
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.pekerjaanRingkas.map((row, idx) => (
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
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
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
                              type="text"
                              value={row.hargaSatuan}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Satuan"
                            />
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
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={row.total}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Total"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removePekerjaanRow(idx)}
                              disabled={formData.pekerjaanRingkas.length === 1}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
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

            {/* Tabs */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleInputChange("activeTab", tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-all duration-200 ${
                      formData.activeTab === tab
                        ? "bg-blue-600 text-white border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - Supply Table */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {formData.activeTab}
                </h3>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                {/* Tenaga Kerja Table */}
                {formData.activeTab === "Tenaga Kerja" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Tenaga
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.tenagaKerja.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.tenaga}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "tenaga",
                                  e.target.value
                                )
                              }
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
                          <td className="px-3 py-2">
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
                              list={`tunjanganOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari tunjangan"
                            />
                            <datalist id={`tunjanganOptions-${index}`}>
                              {tunjanganOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={item.satuan}
                              onChange={(e) =>
                                handleTabDataChange(index, "satuan", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                            >
                              {satuanOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.tenagaKerja.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* PPE Table */}
                {formData.activeTab === "PPE" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Nama Barang (PPE)
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        {/* Removed Hari column for PPE */}
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.ppe.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.namaBarang}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "namaBarang",
                                  e.target.value
                                )
                              }
                              list={`ppeOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari PPE"
                            />
                            <datalist id={`ppeOptions-${index}`}>
                              {ppeOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          {/* Removed Hari input cell for PPE */}
                          <td className="px-3 py-2">
                            <select
                              value={item.satuan}
                              onChange={(e) =>
                                handleTabDataChange(index, "satuan", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                            >
                              {satuanOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaSatuan}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hargaSatuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.ppe.length === 1}
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
                {formData.activeTab === "Jasa" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jasa
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.jasa.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.jasa}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jasa",
                                  e.target.value
                                )
                              }
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
                          <td className="px-3 py-2">
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
                              list={`tunjanganJasaOptions-${index}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Pilih / cari tunjangan"
                            />
                            <datalist id={`tunjanganJasaOptions-${index}`}>
                              {tunjanganOptions.map((opt) => (
                                <option key={opt} value={opt} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={item.satuan}
                              onChange={(e) =>
                                handleTabDataChange(index, "satuan", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                            >
                              {satuanOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.jasa.length === 1}
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
                {formData.activeTab === "Alat" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Alat
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.alat.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.alat}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "alat",
                                  e.target.value
                                )
                              }
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
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={item.satuan}
                              onChange={(e) =>
                                handleTabDataChange(index, "satuan", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                            >
                              {satuanOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaSatuan}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hargaSatuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.alat.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Barang & Consumeble Table */}
                {formData.activeTab === "Barang & Consumeble" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Nama Barang
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.barang.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.namaBarang}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "namaBarang",
                                  e.target.value
                                )
                              }
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
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "jumlah",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={item.satuan}
                              onChange={(e) =>
                                handleTabDataChange(index, "satuan", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                            >
                              {satuanOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.satuan}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "satuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Satuan"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaSatuan}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "hargaSatuan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.barang.length === 1}
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
                {formData.activeTab === "MobDemob" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          MobDemob
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Satuan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Awal
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.mobDemob.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.namaTransportasi}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "namaTransportasi",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Nama Transportasi"
                            />
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.mobDemob.length === 1}
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
                {formData.activeTab === "Biaya Lain-lain" && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Nama Biaya
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Tunjangan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Project Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Hari
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Awal
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Harga Akhir
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.biayaLainLain.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.namaBiaya}
                              onChange={(e) =>
                                handleTabDataChange(
                                  index,
                                  "namaBiaya",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                              placeholder="Nama Biaya"
                            />
                          </td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.hargaAkhir}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.biayaLainLain.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Sisa HPP Table - Empty placeholder */}
                {formData.activeTab === "Sisa HPP" && (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Sisa HPP
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Data sisa HPP akan ditampilkan di sini setelah semua tab
                      lain diisi.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={addTabData}
              className="px-2.5 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Baris</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Simpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HPPIndukModal;
