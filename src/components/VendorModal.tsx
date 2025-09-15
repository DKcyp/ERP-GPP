import React, { useState, useEffect } from "react";
import { X, Save, Loader2, CalendarDays } from "lucide-react";

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VendorFormData) => void;
}

export interface VendorFormData {
  tanggal: string;
  namaVendor: string;
  kodeVendor: string;
  kodeGroupSupplier: string;
  mataUang: string;
  pajak: string;
  alamatVendor: string;
  kota: string;
  negara: string;
  picVendor: string;
  noTelp: string;
  email: string;
  noNPWP: string;
  status: string;
  attachmentLegalitas: File | null;
}

const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<VendorFormData>({
    tanggal: "",
    namaVendor: "",
    kodeVendor: "",
    kodeGroupSupplier: "",
    mataUang: "",
    pajak: "",
    alamatVendor: "",
    kota: "",
    negara: "",
    picVendor: "",
    noTelp: "",
    email: "",
    noNPWP: "",
    status: "",
    attachmentLegalitas: null,
  });

  const [errors, setErrors] = useState<Partial<VendorFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Dummy options for dropdowns
  const kodeGroupSupplierOptions = ["Group A", "Group B", "Group C"];
  const mataUangOptions = ["IDR", "USD", "EUR"];
  const pajakOptions = [
    "PPH 4 ayat 2",
    "PPH 21",
    "PPN 11%",
    "PPH 23",
    "Tidak Kena Pajak",
  ];
  const statusOptions = ["Aktif", "Tidak Aktif"];

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
    const newErrors: Partial<VendorFormData> = {};

    if (!formData.tanggal.trim()) newErrors.tanggal = "Tanggal wajib diisi";
    if (!formData.namaVendor.trim())
      newErrors.namaVendor = "Nama Vendor wajib diisi";
    if (!formData.kodeVendor.trim())
      newErrors.kodeVendor = "Kode Vendor wajib diisi";
    if (!formData.alamatVendor.trim())
      newErrors.alamatVendor = "Alamat Vendor wajib diisi";
    if (!formData.kota.trim()) newErrors.kota = "Kota wajib diisi";
    if (!formData.negara.trim()) newErrors.negara = "Negara wajib diisi";
    if (!formData.picVendor.trim())
      newErrors.picVendor = "PIC Vendor wajib diisi";
    if (!formData.noTelp.trim()) newErrors.noTelp = "No. Telp wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    // No NPWP is optional based on the image, so no validation for it unless specified.
    // Dropdowns can have default empty value, so no validation unless required.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof VendorFormData, value: string) => {
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
      tanggal: "",
      namaVendor: "",
      kodeVendor: "",
      kodeGroupSupplier: "",
      mataUang: "",
      pajak: "",
      alamatVendor: "",
      kota: "",
      negara: "",
      picVendor: "",
      noTelp: "",
      email: "",
      noNPWP: "",
      status: "",
      attachmentLegalitas: null,
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900">Entry Vendor</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) =>
                        handleInputChange("tanggal", e.target.value)
                      }
                      className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10 ${
                        errors.tanggal
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.tanggal && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.tanggal}
                    </p>
                  )}
                </div>

                {/* Nama Vendor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Vendor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaVendor}
                    onChange={(e) =>
                      handleInputChange("namaVendor", e.target.value)
                    }
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.namaVendor
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="PT Maju Jaya"
                  />
                  {errors.namaVendor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.namaVendor}
                    </p>
                  )}
                </div>

                {/* Kode Vendor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Vendor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kodeVendor}
                    onChange={(e) =>
                      handleInputChange("kodeVendor", e.target.value)
                    }
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.kodeVendor
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="VND001"
                  />
                  {errors.kodeVendor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.kodeVendor}
                    </p>
                  )}
                </div>

                {/* Kode Group Supplier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Group Supplier
                  </label>
                  <select
                    value={formData.kodeGroupSupplier}
                    onChange={(e) =>
                      handleInputChange("kodeGroupSupplier", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Pilih Kode Group</option>
                    {kodeGroupSupplierOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mata Uang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Uang
                  </label>
                  <select
                    value={formData.mataUang}
                    onChange={(e) =>
                      handleInputChange("mataUang", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Pilih Mata Uang</option>
                    {mataUangOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Pilih Status</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alamat Vendor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Vendor <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.alamatVendor}
                    onChange={(e) =>
                      handleInputChange("alamatVendor", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.alamatVendor
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Jl. Merdeka No. 1, Jakarta"
                  />
                  {errors.alamatVendor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.alamatVendor}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Kota */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) => handleInputChange("kota", e.target.value)}
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.kota
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Jakarta"
                  />
                  {errors.kota && (
                    <p className="mt-1 text-sm text-red-600">{errors.kota}</p>
                  )}
                </div>

                {/* Negara */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Negara <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.negara}
                    onChange={(e) =>
                      handleInputChange("negara", e.target.value)
                    }
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.negara
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Indonesia"
                  />
                  {errors.negara && (
                    <p className="mt-1 text-sm text-red-600">{errors.negara}</p>
                  )}
                </div>

                {/* PIC Vendor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIC Vendor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.picVendor}
                    onChange={(e) =>
                      handleInputChange("picVendor", e.target.value)
                    }
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.picVendor
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Andi Saputra"
                  />
                  {errors.picVendor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.picVendor}
                    </p>
                  )}
                </div>

                {/* No. Telp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.noTelp}
                    onChange={(e) =>
                      handleInputChange("noTelp", e.target.value)
                    }
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.noTelp
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="081234567890"
                  />
                  {errors.noTelp && (
                    <p className="mt-1 text-sm text-red-600">{errors.noTelp}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-2 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="vendor@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* No. NPWP / NIK */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. NPWP / NIK
                  </label>
                  <input
                    type="text"
                    value={formData.noNPWP}
                    onChange={(e) =>
                      handleInputChange("noNPWP", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="XX.XXX.XXX.X-XXX.XXX"
                  />
                </div>

                {/* Attachment Legalitas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment Legalitas
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        attachmentLegalitas:
                          e.target.files && e.target.files[0]
                            ? e.target.files[0]
                            : null,
                      }))
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-xl"
                  />
                  {formData.attachmentLegalitas && (
                    <div className="mt-1 text-xs text-gray-600">
                      File dipilih: {formData.attachmentLegalitas.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-xs"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
        </div>
      </div>
    </div>
  );
};

export default VendorModal;
