import React, { useState, useEffect } from "react";
import { X, Calendar, Save, Loader2 } from "lucide-react";

interface ProsesProduksiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProsesProduksiFormData) => void;
  initialData?: Partial<ProsesProduksiFormData>;
  readOnly?: boolean;
}

export interface ProsesProduksiFormData {
  noSOTurunan: string;
  namaProyek: string;
  mob: string;
  demob: string;
  tglPenerimaanReportTeknisi: string;
  tglPenerimaanFinalReport: string;
  // New approval dates
  tglApprovalReport?: string;
  tglApprovalBAST?: string;
  tglFinalApproval?: string;
  nilaiProduksi: string;
  statusReport: "Approved" | "Revisi" | "Pending";
  noKontrak?: string;
  noReportTerakhir?: string;
  noPOSAP?: string;
  ro?: string;
  cro?: string;
  // Optional file attachment (object URL, client-side only)
  fileUrl?: string;
  fileName?: string;
  // Optional metode pengerjaan rows (synced with local rows state)
  metodePengerjaan?: Array<{ jenisPekerjaan: string; jumlah: string }>;
  // New fields requested: Alur Dokumen & Status Dokumen
  alurDokumen?: string;
  statusDokumen?: string;
}

const ProsesProduksiModal: React.FC<ProsesProduksiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  readOnly = false,
}) => {
  const [formData, setFormData] = useState<ProsesProduksiFormData>({
    noSOTurunan: "",
    namaProyek: "",
    mob: "",
    demob: "",
    tglPenerimaanReportTeknisi: "",
    tglPenerimaanFinalReport: "",
    tglApprovalReport: "",
    tglApprovalBAST: "",
    tglFinalApproval: "",
    nilaiProduksi: "",
    statusReport: "Approved",
    noKontrak: "",
    noReportTerakhir: "001-00/GBP/UT/I/2025",
    noPOSAP: "",
    ro: "",
    cro: "",
    fileUrl: undefined,
    fileName: undefined,
    alurDokumen: "",
    statusDokumen: "",
  });

  const [errors, setErrors] = useState<Partial<ProsesProduksiFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  // Local state for Metode Pengerjaan section (replicating SOTurunanModal bottom section)
  const [metodePengerjaanRows, setMetodePengerjaanRows] = useState<
    Array<{ jenisPekerjaan: string; jumlah: string }>
  >([{ jenisPekerjaan: "", jumlah: "0" }]);

  const soTurunanOptions = [
    "SO101.12",
    "SO102.33",
    "SO103.12",
    "SO104.87",
    "SO105.21",
  ];

  const proyekOptions = [
    "Proyek A",
    "Proyek B",
    "Proyek C",
    "Proyek D",
    "Proyek E",
  ];

  // Alur Dokumen & dynamic Status Dokumen options
  const alurDokumenOptions = [
    "Project PHE ONWJ",
    "Project Medco Gresik",
    "Pertamina Hulu Mahakam",
  ];
  const statusByAlur: Record<string, string[]> = {
    "Project PHE ONWJ": [
      "SUBMIT & AFTER REVISI REPORT",
      "PREPARE TIDMS",
      "SCAN DAN BURNING FILM",
      "BAP",
      "BAP AFTER REVISI",
      "PREPARE & SUBMIT PI",
      "PREPARE SP3",
      "PREPARE INVOICE",
    ],
    "Project Medco Gresik": [
      "SUBMIT REPORT",
      "VERIFIKASI REPORT BA",
      "PI SUBMISSION",
      "PROSES INVOICE",
      "LOKET TERM",
      "PLAN SO MINUS",
    ],
    "Pertamina Hulu Mahakam": [
      "Approval SES, BAST & SP3",
      "SUBMIT DRAFT PBR",
      "REVIEW REPORT",
      "APPROVAL PBR",
      "SUBMIT BAST & SP3 VENDOR LIST",
      "REQUEST NO INV/KWI/FP",
      "SUBMIT COMPILED INVOICE TO LIKET PHM FOR VERIFICATION",
      "LOKET PHM",
    ],
  };
  const currentStatusOptions = formData.alurDokumen
    ? statusByAlur[formData.alurDokumen] || []
    : [];

  // Options to mirror SOTurunanModal
  const jenisPekerjaanOptions = [
    "On Call",
    "Project Based",
    "Maintenance",
    "Consulting",
  ];

  // Unit price per metode (mirror SOTurunanModal mapping)
  const jenisPekerjaanUnitPrice: Record<string, number> = {
    "On Call": 1500000,
    "Project Based": 2500000,
    Maintenance: 1000000,
    Consulting: 2000000,
  };

  // Tabs and table states (Tenaga Kerja) to mirror SOTurunanModal
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
      pegawai: "Budi Santo",
      tenaga: "Teknisi",
      tunjangan: "Uang Makan",
      projectRate: "250000",
      hari: "5",
      unit: "H",
      margin: "10",
      hargaAkhir: "1375000",
    },
  ]);

  // Datalists
  const tenagaOptions = ["Teknisi", "Supervisor", "Operator", "Admin"];
  const pegawaiOptions = [
    "Budi Santo",
    "Siti Aminah",
    "Joko Susilo",
    "Dewi Lestari",
    "Agus Salim",
  ];
  const tunjanganOptions = ["Uang Makan", "Transport", "Lembur"];

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

  // Dummy data autofill based on No SO Turunan selection
  const dummyBySo: Record<string, Partial<ProsesProduksiFormData>> = {
    "SO101.12": {
      namaProyek: "Proyek A",
      mob: "2025-09-01",
      demob: "2025-09-10",
      tglPenerimaanReportTeknisi: "2025-09-11",
      tglPenerimaanFinalReport: "2025-09-12",
      nilaiProduksi: "Rp 50.000.000",
      statusReport: "Approved",
    },
    "SO102.33": {
      namaProyek: "Proyek B",
      mob: "2025-09-03",
      demob: "2025-09-14",
      tglPenerimaanReportTeknisi: "2025-09-15",
      tglPenerimaanFinalReport: "2025-09-17",
      nilaiProduksi: "Rp 65.000.000",
      statusReport: "Approved",
    },
    "SO103.12": {
      namaProyek: "Proyek C",
      mob: "2025-09-05",
      demob: "2025-09-16",
      tglPenerimaanReportTeknisi: "2025-09-17",
      tglPenerimaanFinalReport: "2025-09-20",
      nilaiProduksi: "Rp 42.500.000",
      statusReport: "Revisi",
    },
    "SO104.87": {
      namaProyek: "Proyek D",
      mob: "2025-09-07",
      demob: "2025-09-18",
      tglPenerimaanReportTeknisi: "2025-09-19",
      tglPenerimaanFinalReport: "2025-09-22",
      nilaiProduksi: "Rp 80.000.000",
      statusReport: "Approved",
    },
    "SO105.21": {
      namaProyek: "Proyek E",
      mob: "2025-09-09",
      demob: "2025-09-20",
      tglPenerimaanReportTeknisi: "2025-09-21",
      tglPenerimaanFinalReport: "2025-09-24",
      nilaiProduksi: "Rp 55.000.000",
      statusReport: "Approved",
    },
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

  // Prefill when editing / viewing
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
      // hydrate metode pengerjaan rows if provided
      if (
        initialData.metodePengerjaan &&
        initialData.metodePengerjaan.length > 0
      ) {
        setMetodePengerjaanRows(
          initialData.metodePengerjaan.map((r) => ({
            jenisPekerjaan: r.jenisPekerjaan || "",
            jumlah: r.jumlah || "",
          }))
        );
      }
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProsesProduksiFormData> = {};

    if (!formData.noSOTurunan.trim()) {
      newErrors.noSOTurunan = "No SO Turunan wajib dipilih";
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = "Nama Proyek wajib dipilih";
    }

    if (!formData.mob) {
      newErrors.mob = "MOB wajib diisi";
    }

    if (!formData.demob) {
      newErrors.demob = "DEMOB wajib diisi";
    }

    if (!formData.tglPenerimaanReportTeknisi) {
      newErrors.tglPenerimaanReportTeknisi =
        "Tanggal Penerimaan Report Teknisi wajib diisi";
    }

    if (!formData.nilaiProduksi.trim()) {
      newErrors.nilaiProduksi = "Nilai Produksi wajib diisi";
    }

    // Optional: if you want to enforce selection, uncomment below
    // if (!formData.alurDokumen) newErrors.alurDokumen = "Alur Dokumen wajib dipilih";
    // if (!formData.statusDokumen) newErrors.statusDokumen = "Status Dokumen wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ProsesProduksiFormData,
    value: string
  ) => {
    if (field === "noSOTurunan") {
      // Merge selected SO Turunan and its dummy payload
      setFormData((prev) => ({
        ...prev,
        noSOTurunan: value,
        ...dummyBySo[value],
      }));

      // Clear related field errors
      const fieldsToClear: (keyof ProsesProduksiFormData)[] = [
        "noSOTurunan",
        "namaProyek",
        "mob",
        "demob",
        "tglPenerimaanReportTeknisi",
        "nilaiProduksi",
      ];
      setErrors((prev) => {
        const clone = { ...prev };
        fieldsToClear.forEach((f) => (clone[f] = undefined));
        return clone;
      });
      return;
    }

    if (field === "alurDokumen") {
      // when alur changes, reset statusDokumen
      setFormData((prev) => ({
        ...prev,
        alurDokumen: value,
        statusDokumen: "",
      }));
      // Clear related errors
      setErrors((prev) => ({
        ...prev,
        alurDokumen: undefined,
        statusDokumen: undefined,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const updateMetodeRow = (
    idx: number,
    field: "jenisPekerjaan" | "jumlah",
    value: string
  ) => {
    setMetodePengerjaanRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value } as {
        jenisPekerjaan: string;
        jumlah: string;
      };
      return next;
    });

    // Autofill Tenaga Kerja numbers based on selected metode and jumlah
    if (field === "jenisPekerjaan") {
      const unit = jenisPekerjaanUnitPrice[value] || 0;
      setTenagaKerja((prev) => {
        return prev.map((r) => {
          const projectRate = unit || Number(r.projectRate) || 0;
          const hari =
            Number(metodePengerjaanRows[idx]?.jumlah || r.hari || 1) || 1;
          const margin = Number(r.margin || 10) || 10;
          const hargaAwal = projectRate * hari;
          const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
          return {
            ...r,
            projectRate: String(projectRate),
            hari: String(hari),
            unit: r.unit || "H",
            margin: String(margin),
            hargaAkhir: String(hargaAkhir),
          };
        });
      });
    }

    if (field === "jumlah") {
      const jumlahNum = Number(value) || 0;
      setTenagaKerja((prev) => {
        return prev.map((r) => {
          const projectRate = Number(r.projectRate) || 0;
          const margin = Number(r.margin || 10) || 10;
          const hargaAwal = projectRate * jumlahNum;
          const hargaAkhir = hargaAwal + (hargaAwal * margin) / 100;
          return {
            ...r,
            hari: String(jumlahNum),
            hargaAkhir: String(hargaAkhir),
          };
        });
      });
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
    // Merge metode pengerjaan rows into payload
    const payload: ProsesProduksiFormData = {
      ...formData,
      metodePengerjaan: metodePengerjaanRows,
    };

    onSave(payload);
    setIsLoading(false);

    // Reset form
    setFormData({
      noSOTurunan: "",
      namaProyek: "",
      mob: "",
      demob: "",
      tglPenerimaanReportTeknisi: "",
      tglPenerimaanFinalReport: "",
      tglApprovalReport: "",
      tglApprovalBAST: "",
      tglFinalApproval: "",
      nilaiProduksi: "",
      statusReport: "Approved",
      noKontrak: "",
      noReportTerakhir: "001-00/GBP/UT/I/2025",
      fileUrl: undefined,
      fileName: undefined,
      alurDokumen: "",
      statusDokumen: "",
    });
    setMetodePengerjaanRows([{ jenisPekerjaan: "", jumlah: "" }]);
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  console.log(
    "ProsesProduksiModal is open. Mode:",
    readOnly ? "view" : "edit/add"
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {readOnly ? "Detail Proses Produksi" : "Entry Proses Produksi"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* No SO Turunan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  No SO Turunan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noSOTurunan}
                  onChange={(e) =>
                    handleInputChange("noSOTurunan", e.target.value)
                  }
                  disabled={readOnly}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.noSOTurunan
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih No SO Turunan</option>
                  {soTurunanOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.noSOTurunan && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.noSOTurunan}
                  </p>
                )}
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaProyek}
                  onChange={(e) =>
                    handleInputChange("namaProyek", e.target.value)
                  }
                  disabled={readOnly}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.namaProyek
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih Nama Proyek</option>
                  {proyekOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.namaProyek && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.namaProyek}
                  </p>
                )}
              </div>

              {/* MOB */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  MOB <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.mob}
                    onChange={(e) => handleInputChange("mob", e.target.value)}
                    disabled={readOnly}
                    className={`w-full px-3 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                      errors.mob
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
                {errors.mob && (
                  <p className="mt-1 text-xs text-red-600">{errors.mob}</p>
                )}
              </div>

              {/* DEMOB */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  DEMOB <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.demob}
                    onChange={(e) => handleInputChange("demob", e.target.value)}
                    disabled={readOnly}
                    className={`w-full px-3 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                      errors.demob
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
                {errors.demob && (
                  <p className="mt-1 text-xs text-red-600">{errors.demob}</p>
                )}
              </div>

              {/* Tanggal Penerimaan Report Teknisi */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tgl Penerimaan Report Teknisi{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglPenerimaanReportTeknisi}
                    onChange={(e) =>
                      handleInputChange(
                        "tglPenerimaanReportTeknisi",
                        e.target.value
                      )
                    }
                    disabled={readOnly}
                    className={`w-full px-3 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                      errors.tglPenerimaanReportTeknisi
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
                {errors.tglPenerimaanReportTeknisi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.tglPenerimaanReportTeknisi}
                  </p>
                )}
              </div>

              {/* Tanggal Penerimaan Final Report */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tgl Penerimaan Final Report
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglPenerimaanFinalReport}
                    onChange={(e) =>
                      handleInputChange(
                        "tglPenerimaanFinalReport",
                        e.target.value
                      )
                    }
                    disabled={readOnly}
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nilai Produksi */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nilai Produksi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nilaiProduksi}
                  onChange={(e) =>
                    handleInputChange("nilaiProduksi", e.target.value)
                  }
                  disabled={readOnly}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.nilaiProduksi
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Rp 80,000,000"
                />
                {errors.nilaiProduksi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.nilaiProduksi}
                  </p>
                )}
              </div>

              {/* Status Report */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status Report
                </label>
                <select
                  value={formData.statusReport}
                  onChange={(e) =>
                    handleInputChange(
                      "statusReport",
                      e.target.value as "Approved" | "Revisi" | "Pending"
                    )
                  }
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="Approved">Approved</option>
                  <option value="Revisi">Revisi</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Alur Dokumen */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Alur Dokumen
                </label>
                <select
                  value={formData.alurDokumen || ""}
                  onChange={(e) =>
                    handleInputChange("alurDokumen", e.target.value)
                  }
                  disabled={readOnly}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                    (errors as any).alurDokumen
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih Alur Dokumen</option>
                  {alurDokumenOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {(errors as any).alurDokumen && (
                  <p className="mt-1 text-xs text-red-600">
                    {(errors as any).alurDokumen}
                  </p>
                )}
              </div>

              {/* Status Dokumen (dynamic based on Alur Dokumen) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status Dokumen
                </label>
                <select
                  value={formData.statusDokumen || ""}
                  onChange={(e) =>
                    handleInputChange("statusDokumen", e.target.value)
                  }
                  disabled={!formData.alurDokumen || readOnly}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                    (errors as any).statusDokumen
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">
                    {formData.alurDokumen
                      ? "Pilih Status Dokumen"
                      : "Pilih Alur Dokumen terlebih dahulu"}
                  </option>
                  {currentStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {(errors as any).statusDokumen && (
                  <p className="mt-1 text-xs text-red-600">
                    {(errors as any).statusDokumen}
                  </p>
                )}
              </div>

              {/* No Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  No. Report
                </label>
                <input
                  type="text"
                  value={formData.noKontrak || ""}
                  onChange={(e) =>
                    handleInputChange("noKontrak", e.target.value)
                  }
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nomor Report"
                />
              </div>

              {/* No Report Terakhir */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  No Report Terakhir
                </label>
                <input
                  type="text"
                  value={formData.noReportTerakhir || ""}
                  onChange={(e) =>
                    handleInputChange("noReportTerakhir", e.target.value)
                  }
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="001-00/GBP/UT/I/2025"
                />
              </div>

              {/* No PO SAP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  No PO SAP
                </label>
                <input
                  type="text"
                  value={formData.noPOSAP || ""}
                  onChange={(e) => handleInputChange("noPOSAP", e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan No PO SAP"
                />
              </div>

              {/* RO */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  RO
                </label>
                <input
                  type="text"
                  value={formData.ro || ""}
                  onChange={(e) => handleInputChange("ro", e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan RO"
                />
              </div>

              {/* CRO */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  CRO
                </label>
                <input
                  type="text"
                  value={formData.cro || ""}
                  onChange={(e) => handleInputChange("cro", e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan CRO"
                />
              </div>

              {/* Tgl Approval Report */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tgl Approval Report
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglApprovalReport || ""}
                    onChange={(e) =>
                      handleInputChange("tglApprovalReport", e.target.value)
                    }
                    disabled={readOnly}
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tgl Approval BAST */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tgl Approval BAST
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglApprovalBAST || ""}
                    onChange={(e) =>
                      handleInputChange("tglApprovalBAST", e.target.value)
                    }
                    disabled={readOnly}
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tgl Final Approval */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tgl Final Approval
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglFinalApproval || ""}
                    onChange={(e) =>
                      handleInputChange("tglFinalApproval", e.target.value)
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Upload File (Report/Attachment) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Upload File (PDF/DOC/XLS/IMG)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData((prev) => ({
                        ...prev,
                        fileUrl: url,
                        fileName: file.name,
                      }));
                    }
                  }}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />

                {formData.fileUrl && (
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <a
                      href={formData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.fileName || "Lihat File"}
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          fileUrl: undefined,
                          fileName: undefined,
                        }))
                      }
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metode Pengerjaan - Match SOTurunanModal style */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-900">
                  Metode Pengerjaan
                </h4>
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
                    {metodePengerjaanRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">
                          <select
                            value={row.jenisPekerjaan}
                            onChange={(e) =>
                              updateMetodeRow(
                                idx,
                                "jenisPekerjaan",
                                e.target.value
                              )
                            }
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
                              updateMetodeRow(idx, "jumlah", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-200 rounded"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {/* Disabled input for alignment, matches screenshot */}
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50"
                            disabled
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                        <th className="px-2 py-2 text-left">Pegawaii</th>
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
                              type="number"
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
                              type="number"
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
                              <option value="H">H</option>
                              <option value="D">D</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
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
                              type="number"
                              value={row.hargaAkhir}
                              onChange={(e) =>
                                updateRow(
                                  setTenagaKerja,
                                  idx,
                                  "hargaAkhir",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  addRow(setTenagaKerja, {
                                    pegawai: "",
                                    tenaga: "",
                                    tunjangan: "",
                                    projectRate: "",
                                    hari: "",
                                    unit: "H",
                                    margin: "",
                                    hargaAkhir: "",
                                  })
                                }
                                className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700"
                              >
                                Tambah
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  removeRow(setTenagaKerja, tenagaKerja)
                                }
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] hover:bg-red-700"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </form>

          {/* Tabs end */}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
          >
            {readOnly ? "Tutup" : "Batal"}
          </button>
          {!readOnly && (
            <button
              onClick={(e) => {
                handleSubmit(e as any);
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs rounded-md text-white flex items-center gap-1 ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProsesProduksiModal;
