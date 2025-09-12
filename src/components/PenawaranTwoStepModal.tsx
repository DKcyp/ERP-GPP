import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PenawaranTwoStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PenawaranTwoStepFormData) => void;
  type: "on-call" | "tender";
}

export interface PenawaranTwoStepFormData {
  // Step 1 data
  noPenawaran: string;
  kategoriPajak: string;
  kodeCustomer: string;
  pajak: string;
  tanggalPenawaran: string;
  tanggalPenawaranEnd: string;
  namaSales: string;
  noRefReq: string;
  namaCustomer: string;
  tanggalKirim: string;
  tanggalFollowUp: string;
  // Attachment for non on-call type
  attachmentFile?: File | null;

  // Step 2 data
  nama: string;
  alamat: string;
  jenisPekerjaan: string;
  perusahaan: string;
  jenisPenawaran: string;
  termCondition: string;
  supplies: Array<{
    item: string;
    description: string;
    qty: string;
    unitPrice: string;
    totalPrice: string;
  }>;
}

const PenawaranTwoStepModal: React.FC<PenawaranTwoStepModalProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PenawaranTwoStepFormData>({
    noPenawaran: "",
    kategoriPajak: "",
    kodeCustomer: "",
    pajak: "",
    tanggalPenawaran: "",
    tanggalPenawaranEnd: "",
    namaSales: "",
    noRefReq: "",
    namaCustomer: "",
    tanggalKirim: "",
    tanggalFollowUp: "",
    attachmentFile: null,
    nama: "",
    alamat: "",
    jenisPekerjaan: "",
    perusahaan: "",
    jenisPenawaran: "",
    termCondition: "",
    supplies: [
      { item: "", description: "", qty: "", unitPrice: "", totalPrice: "" },
    ],
  });

  const [errors, setErrors] = useState<Partial<PenawaranTwoStepFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const kategoriPajakOptions = ["PPN", "Non-PPN"];
  const pajakOptions = ["Include", "Exclude"];
  const salesOptions = [
    "Ahmad Rizki",
    "Sari Dewi",
    "Budi Santoso",
    "Maya Putri",
    "Andi Wijaya",
  ];
  const jenisPekerjaanOptions = ["On Call", "Project Based", "Maintenance"];
  const jenisPenawaranOptions = ["Lumpsum", "Unit Price", "Time & Material"];

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

  // Ensure we are always on step 1 when not on-call
  useEffect(() => {
    if (type !== "on-call" && currentStep !== 1) {
      setCurrentStep(1);
    }
  }, [type, currentStep]);

  const handleInputChange = (
    field: keyof PenawaranTwoStepFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSupplyChange = (index: number, field: string, value: string) => {
    const newSupplies = [...formData.supplies];
    newSupplies[index] = { ...newSupplies[index], [field]: value };

    // Auto calculate total price
    if (field === "qty" || field === "unitPrice") {
      const qty =
        parseFloat(field === "qty" ? value : newSupplies[index].qty) || 0;
      const unitPrice =
        parseFloat(
          field === "unitPrice" ? value : newSupplies[index].unitPrice
        ) || 0;
      newSupplies[index].totalPrice = (qty * unitPrice).toString();
    }

    setFormData((prev) => ({ ...prev, supplies: newSupplies }));
  };

  const addSupply = () => {
    setFormData((prev) => ({
      ...prev,
      supplies: [
        ...prev.supplies,
        { item: "", description: "", qty: "", unitPrice: "", totalPrice: "" },
      ],
    }));
  };

  const removeSupply = (index: number) => {
    if (formData.supplies.length > 1) {
      setFormData((prev) => ({
        ...prev,
        supplies: prev.supplies.filter((_, i) => i !== index),
      }));
    }
  };

  const validateStep1 = (): boolean => {
    // Validation disabled per request: allow proceeding without required checks
    setErrors({});
    return true;
  };

  const validateStep2 = (): boolean => {
    // Validation disabled per request
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation disabled

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSave(formData);
    setIsLoading(false);

    // Reset form
    setFormData({
      noPenawaran: "",
      kategoriPajak: "",
      kodeCustomer: "",
      pajak: "",
      tanggalPenawaran: "",
      tanggalPenawaranEnd: "",
      namaSales: "",
      noRefReq: "",
      namaCustomer: "",
      tanggalKirim: "",
      tanggalFollowUp: "",
      attachmentFile: null,
      nama: "",
      alamat: "",
      jenisPekerjaan: "",
      perusahaan: "",
      jenisPenawaran: "",
      termCondition: "",
      supplies: [
        { item: "", description: "", qty: "", unitPrice: "", totalPrice: "" },
      ],
    });
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalTitle =
    type === "on-call" ? "Entry Penawaran On Call" : "Entry Penawaran Tender";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>

            {/* Stepper */}
            <div className="flex items-center justify-between mt-6 max-w-md">
              {/* Step 1 */}
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? "bg-blue-600 text-white shadow-lg"
                      : currentStep > 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    currentStep === 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Entry 1
                </span>
              </div>
              {type === "on-call" && (
                <>
                  {/* Connector Line */}
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 w-full transition-colors duration-200 ${
                        currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        currentStep === 2
                          ? "bg-blue-600 text-white shadow-lg"
                          : currentStep > 2
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        currentStep === 2 ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      Various information
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* No Penawaran */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    No Penawaran
                  </label>
                  <input
                    type="text"
                    value={formData.noPenawaran}
                    onChange={(e) =>
                      handleInputChange("noPenawaran", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200`}
                    placeholder="Masukkan no penawaran"
                  />
                </div>

                {/* Nama Sales */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Sales
                  </label>
                  <select
                    value={formData.namaSales}
                    onChange={(e) => handleInputChange("namaSales", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  >
                    <option value="">Pilih Nama Sales</option>
                    {salesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kategori Pajak */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Kategori Pajak
                  </label>
                  <select
                    value={formData.kategoriPajak}
                    onChange={(e) =>
                      handleInputChange("kategoriPajak", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200`}
                  >
                    <option value="">Pilih Kategori Pajak</option>
                    {kategoriPajakOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* No. Ref Req - removed per request */}

                {/* Kode Customer - removed per request */}

                {/* Nama Customer */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Customer
                  </label>
                  <input
                    type="text"
                    value={formData.namaCustomer}
                    onChange={(e) =>
                      handleInputChange("namaCustomer", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200`}
                    placeholder="Masukkan nama customer"
                  />
                </div>

                {/* Pajak */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pajak
                  </label>
                  <select
                    value={formData.pajak}
                    onChange={(e) => handleInputChange("pajak", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  >
                    <option value="">Pilih Pajak</option>
                    {pajakOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tanggal Kirim */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tanggal Kirim
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggalKirim}
                      onChange={(e) =>
                        handleInputChange("tanggalKirim", e.target.value)
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tanggal Penawaran */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tanggal Penawaran
                  </label>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.tanggalPenawaran}
                        onChange={(e) =>
                          handleInputChange("tanggalPenawaran", e.target.value)
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200`}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="text-center text-gray-500 font-medium text-xs">
                      <span>S/d</span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.tanggalPenawaranEnd}
                        onChange={(e) =>
                          handleInputChange(
                            "tanggalPenawaranEnd",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Tanggal Follow up */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tanggal Follow up
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggalFollowUp}
                      onChange={(e) =>
                        handleInputChange("tanggalFollowUp", e.target.value)
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Upload File (only for non on-call) */}
                {type !== "on-call" && (
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Upload Dokumen Penawaran
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attachmentFile: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200"
                    />
                    <p className="mt-1 text-[10px] text-gray-500">
                      Format yang didukung: PDF, DOCX, XLSX, gambar. Maks 10MB.
                    </p>
                  </div>
                )}
              </div>
            )}

            {type === "on-call" && currentStep === 2 && (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) =>
                        handleInputChange("nama", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200`}
                      placeholder="Masukkan nama"
                    />
                  </div>

                  {/* Perusahaan */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Perusahaan
                    </label>
                    <input
                      type="text"
                      value={formData.perusahaan}
                      onChange={(e) =>
                        handleInputChange("perusahaan", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                      placeholder="Masukkan nama perusahaan"
                    />
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <textarea
                      value={formData.alamat}
                      onChange={(e) =>
                        handleInputChange("alamat", e.target.value)
                      }
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-xs border-gray-200`}
                      placeholder="Masukkan alamat"
                    />
                  </div>

                  {/* Jenis Penawaran */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Jenis Penawaran
                    </label>
                    <select
                      value={formData.jenisPenawaran}
                      onChange={(e) =>
                        handleInputChange("jenisPenawaran", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                    >
                      <option value="">Pilih Jenis Penawaran</option>
                      {jenisPenawaranOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs border-gray-200`}
                    >
                      <option value="">Pilih Jenis Pekerjaan</option>
                      {jenisPekerjaanOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Term & Condition */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Term & Condition
                  </label>
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 min-h-[200px]">
                    <ReactQuill
                      theme="snow"
                      value={
                        formData.termCondition || `
<ol>
  <li>Price above excluded VAT 11%.</li>
  <li>Term of payment must be pay DP Rp. 35.000.000,- (for 250 Sheet) before the work is carried out.</li>
  <li>The price above are excluded:
    <ul>
      <li>Mob Demob Transport and Ticket From Jakarta to Site provided by client</li>
      <li>Hotel/Mess and Meals provided by client</li>
      <li>PCR/SWAB Mob Demob provided by client</li>
      <li>Working Permit are provided by client</li>
      <li>Local transportations are supplied by client</li>
      <li>Over baggage are provided by client</li>
    </ul>
  </li>
  <li>If any Quarantine manpower because special situation will be charged 100% quarantine rate price and Hotel Meal supplied by Client.</li>
  <li>Work will be start if SPK/WO/PO is received by PT. Gamma Buana Persada.</li>
  <li>Working hours is 8 (eight) hours per day, overtime will be charged 100% from daily rates.</li>
  <li>Stand by team and equipment caused by any delays schedule or non-productive time caused by other operations or circumstances out of the control of PT. Gamma Buana Persada (including weather) will be charged 50% daily rate price.</li>
  <li>Work instruction or client specification, scaffolding, electrical and lighting, safety tools for high risk work, dark room facility, bunker/boom feet facility supplied by client.</li>
  <li>Starting timesheet counted when our equipment and technician go from and return to PT. Gamma Buana Persada.</li>
  <li>This quotation is valid for one (1) week from the date of quotation.</li>
</ol>`
                      }
                      onChange={(content) => handleInputChange("termCondition", content)}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "list",
                        "bullet",
                        "link",
                      ]}
                    />
                  </div>
                </div>

                {/* Supply Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-medium text-gray-700">
                      Supply
                    </label>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                            Item
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                            Description
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                            QTY
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                            Unit Price
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                            Total Price
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.supplies.map((supply, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={supply.item}
                                onChange={(e) =>
                                  handleSupplyChange(
                                    index,
                                    "item",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                placeholder="Item"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={supply.description}
                                onChange={(e) =>
                                  handleSupplyChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                placeholder="Description"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={supply.qty}
                                onChange={(e) =>
                                  handleSupplyChange(
                                    index,
                                    "qty",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                placeholder="Qty"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={supply.unitPrice}
                                onChange={(e) =>
                                  handleSupplyChange(
                                    index,
                                    "unitPrice",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                placeholder="Unit Price"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={supply.totalPrice}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
                                placeholder="Total Price"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => removeSupply(index)}
                                className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors"
                                disabled={formData.supplies.length === 1}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addSupply}
                  className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Supply
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex space-x-3">
            {type === "on-call" && currentStep === 2 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
            >
              Close
            </button>
          </div>

          <div className="flex space-x-3">
            {currentStep === 1 && type === "on-call" ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenawaranTwoStepModal;
