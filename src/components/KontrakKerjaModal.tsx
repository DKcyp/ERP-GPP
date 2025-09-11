import React, { useState, useEffect } from "react";
import { X, Calendar, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { TunjanganItem } from "../types";

interface KontrakKerjaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KontrakKerjaFormData) => void;
}

export interface KontrakKerjaFormData {
  nomorKontrak: string;
  penerimaKontrak: string;
  periodeKontrakStart: string;
  periodeKontrakEnd: string;
  keterangan: string;
  uploadSuratLamaran: File | null;
  uploadCV: File | null;
  uploadFotoDiri: File | null;
  uploadSertifikasi: File | null;
  tunjangan: TunjanganItem[];
  kualifikasi: string[];
}

const KontrakKerjaModal: React.FC<KontrakKerjaModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<KontrakKerjaFormData>({
    nomorKontrak: "",
    penerimaKontrak: "",
    periodeKontrakStart: "",
    periodeKontrakEnd: "",
    keterangan: "",
    uploadSuratLamaran: null,
    uploadCV: null,
    uploadFotoDiri: null,
    uploadSertifikasi: null,
    tunjangan: [{ namaTunjangan: "Transport", nominal: "Rp. 2.000.000" }],
    kualifikasi: [],
  });

  const [errors, setErrors] = useState<Partial<KontrakKerjaFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Options for Kualifikasi Pegawai multi-select
  const kualifikasiOptions: string[] = [
    "SMA/SMK",
    "D3",
    "S1",
    "S2",
    "S3",
    "Sertifikasi K3",
    "Sertifikasi Operator",
    "Bahasa Inggris",
    "Pengalaman > 5 tahun",
  ];
  const [kualifikasiQuery, setKualifikasiQuery] = useState("");
  const filteredKualifikasi = kualifikasiOptions.filter((opt) =>
    opt.toLowerCase().includes(kualifikasiQuery.toLowerCase())
  );
  const toggleKualifikasi = (value: string) => {
    setFormData((prev) => {
      const exists = prev.kualifikasi.includes(value);
      return {
        ...prev,
        kualifikasi: exists
          ? prev.kualifikasi.filter((v) => v !== value)
          : [...prev.kualifikasi, value],
      };
    });
  };
  const removeKualifikasi = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      kualifikasi: prev.kualifikasi.filter((v) => v !== value),
    }));
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
    const newErrors: Partial<KontrakKerjaFormData> = {};

    if (!formData.nomorKontrak.trim()) {
      newErrors.nomorKontrak = "Nomor Kontrak wajib diisi";
    }

    if (!formData.penerimaKontrak.trim()) {
      newErrors.penerimaKontrak = "Penerima Kontrak wajib diisi";
    }

    if (!formData.periodeKontrakStart) {
      newErrors.periodeKontrakStart = "Periode Kontrak Start wajib diisi";
    }

    if (!formData.periodeKontrakEnd) {
      newErrors.periodeKontrakEnd = "Periode Kontrak End wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof KontrakKerjaFormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTunjanganChange = (
    index: number,
    field: keyof TunjanganItem,
    value: string
  ) => {
    const newTunjangan = [...formData.tunjangan];
    newTunjangan[index] = { ...newTunjangan[index], [field]: value };
    setFormData((prev) => ({ ...prev, tunjangan: newTunjangan }));
  };

  const addTunjangan = () => {
    setFormData((prev) => ({
      ...prev,
      tunjangan: [...prev.tunjangan, { namaTunjangan: "", nominal: "" }],
    }));
  };

  const removeTunjangan = (index: number) => {
    if (formData.tunjangan.length > 1) {
      setFormData((prev) => ({
        ...prev,
        tunjangan: prev.tunjangan.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileChange = (
    field: keyof KontrakKerjaFormData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    handleInputChange(field, file);
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
      nomorKontrak: "",
      penerimaKontrak: "",
      periodeKontrakStart: "",
      periodeKontrakEnd: "",
      keterangan: "",
      uploadSuratLamaran: null,
      uploadCV: null,
      uploadFotoDiri: null,
      uploadSertifikasi: null,
      tunjangan: [{ namaTunjangan: "Transport", nominal: "Rp. 2.000.000" }],
      kualifikasi: [],
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Entry Kontrak Kerja
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nomor Kontrak */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Kontrak <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomorKontrak}
                    onChange={(e) =>
                      handleInputChange("nomorKontrak", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.nomorKontrak
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="KO-001"
                  />
                  {errors.nomorKontrak && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nomorKontrak}
                    </p>
                  )}
                </div>

                {/* Penerima Kontrak */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penerima Kontrak <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.penerimaKontrak}
                    onChange={(e) =>
                      handleInputChange("penerimaKontrak", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.penerimaKontrak
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Michael Scott"
                  />
                  {errors.penerimaKontrak && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.penerimaKontrak}
                    </p>
                  )}
                </div>
              </div>

              {/* Periode Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Kontrak <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.periodeKontrakStart}
                      onChange={(e) =>
                        handleInputChange("periodeKontrakStart", e.target.value)
                      }
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.periodeKontrakStart
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="text-center text-sm text-gray-500">S.D</div>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.periodeKontrakEnd}
                      onChange={(e) =>
                        handleInputChange("periodeKontrakEnd", e.target.value)
                      }
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.periodeKontrakEnd
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {(errors.periodeKontrakStart || errors.periodeKontrakEnd) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.periodeKontrakStart || errors.periodeKontrakEnd}
                  </p>
                )}
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) =>
                    handleInputChange("keterangan", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Kontrak jangka panjang dengan benefit penuh."
                />
              </div>

              {/* Kualifikasi Pegawai (Searchable Multi-Select) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kualifikasi Pegawai
                </label>
                {/* Selected tags */}
                {formData.kualifikasi.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.kualifikasi.map((k) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                      >
                        {k}
                        <button
                          type="button"
                          onClick={() => removeKualifikasi(k)}
                          className="ml-1 text-emerald-700 hover:text-emerald-900"
                          aria-label={`Remove ${k}`}
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Search input */}
                <input
                  type="text"
                  value={kualifikasiQuery}
                  onChange={(e) => setKualifikasiQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-t-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari kualifikasi..."
                />
                {/* Options list */}
                <div className="max-h-48 overflow-y-auto border border-t-0 border-gray-200 rounded-b-xl">
                  {filteredKualifikasi.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Tidak ada opsi
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {filteredKualifikasi.map((opt) => {
                        const selected = formData.kualifikasi.includes(opt);
                        return (
                          <li key={opt}>
                            <button
                              type="button"
                              onClick={() => toggleKualifikasi(opt)}
                              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                                selected ? "bg-blue-50" : "bg-white"
                              }`}
                            >
                              <span className="text-gray-700">{opt}</span>
                              <span
                                className={`ml-2 inline-flex h-4 w-4 items-center justify-center rounded border ${
                                  selected
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "border-gray-300"
                                }`}
                                aria-hidden
                              >
                                {selected ? "✓" : ""}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Surat Lamaran Kerja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Surat Lamaran Kerja
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("uploadSuratLamaran", e)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    accept=".pdf,.doc,.docx"
                  />
                  {formData.uploadSuratLamaran && (
                    <p className="mt-2 text-sm text-green-600">
                      File selected: {formData.uploadSuratLamaran.name}
                    </p>
                  )}
                </div>

                {/* Upload CV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CV
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("uploadCV", e)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    accept=".pdf,.doc,.docx"
                  />
                  {formData.uploadCV && (
                    <p className="mt-2 text-sm text-green-600">
                      File selected: {formData.uploadCV.name}
                    </p>
                  )}
                </div>

                {/* Upload Foto Diri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Foto Diri
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("uploadFotoDiri", e)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    accept=".jpg,.jpeg,.png,.gif"
                  />
                  {formData.uploadFotoDiri && (
                    <p className="mt-2 text-sm text-green-600">
                      File selected: {formData.uploadFotoDiri.name}
                    </p>
                  )}
                </div>

                {/* Upload Sertifikasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Sertifikasi
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("uploadSertifikasi", e)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {formData.uploadSertifikasi && (
                    <p className="mt-2 text-sm text-green-600">
                      File selected: {formData.uploadSertifikasi.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Tunjangan Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Tunjangan
                  </label>
                  <button
                    type="button"
                    onClick={addTunjangan}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Nama Tunjangan
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Nominal
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.tunjangan.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.namaTunjangan}
                              onChange={(e) =>
                                handleTunjanganChange(
                                  index,
                                  "namaTunjangan",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Transport"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.nominal}
                              onChange={(e) =>
                                handleTunjanganChange(
                                  index,
                                  "nominal",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp. 2.000.000"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTunjangan(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.tunjangan.length === 1}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KontrakKerjaModal;
