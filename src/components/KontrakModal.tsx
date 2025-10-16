import React, { useState, useEffect } from "react";
import { X, Calendar, Save, Loader2 } from "lucide-react";

interface KontrakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KontrakFormData) => void;
}

export interface KontrakFormData {
  noKontrak: string; // Changed from namaClient to noKontrak
  tanggalAwal: string;
  tanggalAkhir: string;
  nilaiKontrak: string;
  sudahDitagihkan?: string;
  sisaPenagihan?: string;
  estimasiPenagihan?: string;
  delayPenagihan?: string;
}

const KontrakModal: React.FC<KontrakModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<KontrakFormData>({
    noKontrak: "",
    tanggalAwal: "",
    tanggalAkhir: "",
    nilaiKontrak: "",
    sudahDitagihkan: "",
    sisaPenagihan: "",
    estimasiPenagihan: "",
    delayPenagihan: "",
  });

  const [errors, setErrors] = useState<Partial<KontrakFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = [
    "PT. Jakarta Tank Terminal",
    "PT. Surabaya Shipping Lines",
    "PT. Bandung Logistics",
    "PT. Medan Cargo Express",
    "PT. Semarang Port Services",
    "PT Teknologi Maju",
    "CV Digital Solutions",
    "PT Industri Kreatif",
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

  const validateForm = (): boolean => {
    const newErrors: Partial<KontrakFormData> = {};

    if (!formData.noKontrak.trim()) {
      newErrors.noKontrak = "No Kontrak wajib diisi";
    }

    if (!formData.tanggalAwal) {
      newErrors.tanggalAwal = "Tanggal Awal wajib diisi";
    }

    if (!formData.tanggalAkhir) {
      newErrors.tanggalAkhir = "Tanggal Akhir wajib diisi";
    }

    if (!formData.nilaiKontrak.trim()) {
      newErrors.nilaiKontrak = "Nilai Kontrak wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof KontrakFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
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
      noKontrak: "",
      tanggalAwal: "",
      tanggalAkhir: "",
      nilaiKontrak: "",
      sudahDitagihkan: "",
      sisaPenagihan: "",
      estimasiPenagihan: "",
      delayPenagihan: "",
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Kontrak</h2>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noKontrak}
                  onChange={(e) =>
                    handleInputChange("noKontrak", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noKontrak
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
                {errors.noKontrak && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.noKontrak}
                  </p>
                )}
              </div>

              {/* Nilai Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nilai Kontrak <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nilaiKontrak}
                  onChange={(e) =>
                    handleInputChange("nilaiKontrak", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nilaiKontrak
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Rp. 200.000.000"
                />
                {errors.nilaiKontrak && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nilaiKontrak}
                  </p>
                )}
              </div>

              {/* Tanggal Awal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Awal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalAwal}
                    onChange={(e) =>
                      handleInputChange("tanggalAwal", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalAwal
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalAwal && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tanggalAwal}
                  </p>
                )}
              </div>

              {/* Tanggal Akhir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalAkhir}
                    onChange={(e) =>
                      handleInputChange("tanggalAkhir", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalAkhir
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalAkhir && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tanggalAkhir}
                  </p>
                )}
              </div>

              {/* Sudah Ditagihkan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sudah Ditagihkan
                </label>
                <input
                  type="text"
                  value={formData.sudahDitagihkan}
                  onChange={(e) =>
                    handleInputChange("sudahDitagihkan", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp. 150.000.000"
                />
              </div>

              {/* Sisa Penagihan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sisa Penagihan
                </label>
                <input
                  type="text"
                  value={formData.sisaPenagihan}
                  onChange={(e) =>
                    handleInputChange("sisaPenagihan", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp. 50.000.000"
                />
              </div>

              {/* Estimasi Penagihan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimasi Penagihan
                </label>
                <input
                  type="text"
                  value={formData.estimasiPenagihan}
                  onChange={(e) =>
                    handleInputChange("estimasiPenagihan", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp. 40.000.000"
                />
              </div>

              {/* Delay Penagihan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay Penagihan
                </label>
                <input
                  type="text"
                  value={formData.delayPenagihan}
                  onChange={(e) =>
                    handleInputChange("delayPenagihan", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="150 Hari"
                />
              </div>
            </div>

            {/* New section for Sisa HPP Table */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Detail Sisa HPP
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tenaga
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Gaji Pokok
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Project Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hari
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        HPP
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Margin
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Harga Penawaran
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sisa HPP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Inspektur NDT Level II (UT)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 15.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 500.000/hari
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 10.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        15%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 11.500.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 1.500.000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Welder Certified (SMAW, GTAW)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 13.500.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 450.000/hari
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        25
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 11.250.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        10%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 12.375.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 2.500.000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Quality Control Engineer
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 18.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 600.000/hari
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 9.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        20%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 10.800.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 1.800.000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Site Manager
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 21.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 700.000/hari
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        18
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 12.600.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        18%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 14.868.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 2.268.000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Helper
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 9.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 300.000/hari
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        30
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 9.000.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        5%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 9.450.000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rp 450.000
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KontrakModal;
