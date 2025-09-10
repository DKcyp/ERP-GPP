import React, { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import type { SOTurunanFormData } from "./SOTurunanModal";

interface RequestSOTurunanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SOTurunanFormData) => void;
}

const RequestSOTurunanModal: React.FC<RequestSOTurunanModalProps> = ({
  isOpen,
  onClose,
  onSave,
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
    jumlahQty: "",
  });

  const [errors, setErrors] = useState<Partial<SOTurunanFormData>>({});

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const setField = (field: keyof SOTurunanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<SOTurunanFormData> = {};
    if (!formData.soInduk) e.soInduk = "SO Induk wajib dipilih";
    if (!formData.soTurunan) e.soTurunan = "SO Turunan wajib diisi";
    if (!formData.nomorKontrak) e.nomorKontrak = "Nomor Kontrak wajib diisi";
    if (!formData.namaProyek) e.namaProyek = "Nama Proyek wajib diisi";
    if (!formData.namaClient) e.namaClient = "Nama Client wajib dipilih";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry SO Turunan</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-160px)] p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* SO Induk */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                SO Induk <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.soInduk}
                onChange={(e) => setField("soInduk", e.target.value)}
                className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.soInduk
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <option value="">Pilih SO Induk</option>
                {soIndukOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {errors.soInduk && (
                <p className="mt-1 text-sm text-red-600">{errors.soInduk}</p>
              )}
            </div>

            {/* Jenis Pekerjaan */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Jenis Pekerjaan
              </label>
              <select
                value={formData.jenisPekerjaan}
                onChange={(e) => setField("jenisPekerjaan", e.target.value)}
                className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Jenis Pekerjaan</option>
                {jenisPekerjaanOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
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
                onChange={(e) => setField("soTurunan", e.target.value)}
                placeholder="Masukkan SO Turunan"
                className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.soTurunan
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              />
              {errors.soTurunan && (
                <p className="mt-1 text-sm text-red-600">{errors.soTurunan}</p>
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
                  onChange={(e) => setField("tanggalMOB", e.target.value)}
                  className="w-full px-2 py-2 pr-8 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                onChange={(e) => setField("nomorKontrak", e.target.value)}
                placeholder="Masukkan nomor kontrak"
                className={`w-full px-2 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nomorKontrak
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
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
                  onChange={(e) => setField("tanggalDemob", e.target.value)}
                  className="w-full px-2 py-2 pr-8 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Jumlah Qty yang Bekerja */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Jumlah Qty yang Bekerja
              </label>
              <input
                type="number"
                min={0}
                value={formData.jumlahQty ?? ""}
                onChange={(e) => setField("jumlahQty", e.target.value)}
                placeholder="0"
                className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                value={formData.keterangan}
                onChange={(e) => setField("keterangan", e.target.value)}
                rows={3}
                placeholder="Masukkan keterangan..."
                className="w-full px-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="lg:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestSOTurunanModal;
