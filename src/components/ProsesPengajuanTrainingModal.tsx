import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Save, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { ProsesPengajuanTrainingFormData } from "../types";

interface ProsesPengajuanTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProsesPengajuanTrainingFormData) => void;
}

// Options for dropdowns
const soOptions = ["SO001", "SO002", "SO003", "SO004", "SO005"];
const soTurunanOptions = ["SO001.12", "SO002.05", "SO003.07", "SO004.10", "SO005.15"];
const karyawanOptions = ["Ahmad Fauzi", "Siti Nurhaliza", "Budi Santoso", "Rina Setiawati", "Dedi Kurniawan"];
const jenisTrainingOptions = ["New Training", "Re-Training"];

interface EmployeeRow {
  id: string;
  kodePegawai: string;
  namaPegawai: string;
  departemen: string;
  nip: string;
  tanggalLahir: string;
  kualifikasi: string;
}

const ProsesPengajuanTrainingModal: React.FC<
  ProsesPengajuanTrainingModalProps
> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProsesPengajuanTrainingFormData>({
    namaPersonil: "",
    jenisPelatihan: "",
    lokasiPelatihan: "",
    tanggalPelaksanaan: "",
    pid: "TIDAK",
    noSO: "",
    soTurunan: "",
    noTraining: "",
    karyawan: "",
    dataPegawai: [],
    tanggalPelatihanStart: "",
    tanggalPelatihanEnd: "",
    jenisTraining: "New Training",
    budget: "",
    keterangan: "",
    lampiran: [],
  });

  const [errors, setErrors] = useState<Partial<ProsesPengajuanTrainingFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newEmployeeRow, setNewEmployeeRow] = useState<Omit<EmployeeRow, 'id'>>({
    kodePegawai: "",
    namaPegawai: "",
    departemen: "",
    nip: "",
    tanggalLahir: "",
    kualifikasi: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const newErrors: Partial<ProsesPengajuanTrainingFormData> = {};
    if (!formData.namaPersonil.trim()) newErrors.namaPersonil = "Nama Personil wajib diisi";
    if (!formData.jenisPelatihan.trim()) newErrors.jenisPelatihan = "Jenis pelatihan wajib diisi";
    if (!formData.lokasiPelatihan.trim()) newErrors.lokasiPelatihan = "Lokasi pelatihan wajib diisi";
    if (!formData.tanggalPelaksanaan) newErrors.tanggalPelaksanaan = "Tanggal pelaksanaan wajib diisi";
    if (!formData.pid) newErrors.pid = "Pilih PID/TIDAK";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProsesPengajuanTrainingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Employee row handlers
  const handleNewEmployeeRowChange = (field: keyof Omit<EmployeeRow, 'id'>, value: string) => {
    setNewEmployeeRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = () => {
    if (!newEmployeeRow.kodePegawai || !newEmployeeRow.namaPegawai) {
      return;
    }
    const newEmployee: EmployeeRow = {
      id: Date.now().toString(),
      ...newEmployeeRow,
    };
    setFormData((prev) => ({
      ...prev,
      dataPegawai: [...(prev.dataPegawai || []), newEmployee],
    }));
    setNewEmployeeRow({
      kodePegawai: "",
      namaPegawai: "",
      departemen: "",
      nip: "",
      tanggalLahir: "",
      kualifikasi: "",
    });
  };

  const handleRemoveEmployee = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      dataPegawai: (prev.dataPegawai || []).filter((emp) => emp.id !== id),
    }));
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        lampiran: [...(prev.lampiran || []), ...newFiles],
      }));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        lampiran: [...(prev.lampiran || []), ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lampiran: (prev.lampiran || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    onSave(formData);
    setIsLoading(false);

    // Reset form
    setFormData({
      namaPersonil: "",
      jenisPelatihan: "",
      lokasiPelatihan: "",
      tanggalPelaksanaan: "",
      pid: "TIDAK",
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">PR Training</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Top Section: No SO, SO Turunan, No Training, Karyawan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* No SO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No SO <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noSO}
                  onChange={(e) => handleInputChange("noSO", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noSO ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih No SO</option>
                  {soOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.noSO && (
                  <p className="mt-1 text-sm text-red-600">{errors.noSO}</p>
                )}
              </div>

              {/* SO Turunan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SO Turunan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.soTurunan}
                  onChange={(e) =>
                    handleInputChange("soTurunan", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.soTurunan
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Pilih SO Turunan</option>
                  {soTurunanOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.soTurunan && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.soTurunan}
                  </p>
                )}
              </div>

              {/* No Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Training <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.noTraining}
                  onChange={(e) =>
                    handleInputChange("noTraining", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noTraining
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="TRNG001"
                />
                {errors.noTraining && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.noTraining}
                  </p>
                )}
              </div>
            </div>

            {/* Karyawan Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Karyawan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.karyawan}
                onChange={(e) => handleInputChange("karyawan", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.karyawan
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <option value="">Pilih Karyawan</option>
                {karyawanOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.karyawan && (
                <p className="mt-1 text-sm text-red-600">{errors.karyawan}</p>
              )}
            </div>

            {/* Data Pegawai Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Data Pegawai
              </h3>
              {errors.dataPegawai && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dataPegawai}
                </p>
              )}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kode Pegawai
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Pegawai
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departemen
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIP
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Lahir
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kualifikasi
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.dataPegawai.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {employee.kodePegawai}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {employee.namaPegawai}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {employee.departemen}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {employee.nip}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {employee.tanggalLahir}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {employee.kualifikasi}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Input row for new employee */}
                    <tr>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={newEmployeeRow.kodePegawai}
                          onChange={(e) =>
                            handleNewEmployeeRowChange(
                              "kodePegawai",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Kode"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={newEmployeeRow.namaPegawai}
                          onChange={(e) =>
                            handleNewEmployeeRowChange(
                              "namaPegawai",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nama"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={newEmployeeRow.departemen}
                          onChange={(e) =>
                            handleNewEmployeeRowChange(
                              "departemen",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Dept"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={newEmployeeRow.nip}
                          onChange={(e) =>
                            handleNewEmployeeRowChange("nip", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="NIP"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={newEmployeeRow.tanggalLahir}
                          onChange={(e) =>
                            handleNewEmployeeRowChange(
                              "tanggalLahir",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={newEmployeeRow.kualifikasi}
                          onChange={(e) =>
                            handleNewEmployeeRowChange(
                              "kualifikasi",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Kualifikasi"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={handleAddEmployee}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Training Details: Tgl Pelatihan, Jenis Training, Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tgl Pelatihan Start */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tgl Pelatihan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalPelatihanStart}
                    onChange={(e) =>
                      handleInputChange("tanggalPelatihanStart", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalPelatihanStart
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalPelatihanStart && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tanggalPelatihanStart}
                  </p>
                )}
              </div>

              {/* Tgl Pelatihan End */}
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-500 mb-2">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={formData.tanggalPelatihanEnd}
                    onChange={(e) =>
                      handleInputChange("tanggalPelatihanEnd", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalPelatihanEnd
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalPelatihanEnd && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tanggalPelatihanEnd}
                  </p>
                )}
              </div>

              {/* Jenis Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Training
                </label>
                <select
                  value={formData.jenisTraining}
                  onChange={(e) =>
                    handleInputChange(
                      "jenisTraining",
                      e.target.value as "New Training" | "Re-Training"
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {jenisTrainingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.budget
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Rp 10.000.000"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.keterangan}
                onChange={(e) =>
                  handleInputChange("keterangan", e.target.value)
                }
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.keterangan
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="Tambahkan keterangan..."
              ></textarea>
              {errors.keterangan && (
                <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
              )}
            </div>

            {/* Lampiran Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Lampiran
              </h3>
              <div
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ${
                  formData.lampiran.length > 0
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-600 text-sm">
                  Drag & Drop your files or{" "}
                  <span className="text-blue-600 font-medium cursor-pointer">
                    Browse
                  </span>
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {formData.lampiran.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Files:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {formData.lampiran.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-800 bg-gray-100 p-2 rounded-md"
                      >
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Approve</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProsesPengajuanTrainingModal;
