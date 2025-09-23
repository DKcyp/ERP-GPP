import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, PlusCircle, Save, Trash2, Loader2 } from "lucide-react";

interface PPDDetailItem {
  id: number;
  noDokumen: string;
  keterangan: string;
  dibayarkanKepada: string;
  namaPenerima: string;
  noRekening: string;
  nominalDPP: number;
  nominalPPN: number;
}

export interface PermintaanPencairanDanaFormData {
  id?: number;
  noPPD: string;
  tglPPDFrom: Date | null;
  tglPPDTo: Date | null;
  divisi: string;
  namaPemohon: string; // Changed from namaSupplier
  mataUang: string;
  statusLunas: "Lunas" | "Belum";
  pertanggungjawaban: "Iya" | "Tidak"; // New field
  jenisDokumen: string;
  detailItems: PPDDetailItem[];
  totalPembayaran: number;
}

interface FinancePermintaanPencairanDanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PermintaanPencairanDanaFormData) => void;
  initialData?: PermintaanPencairanDanaFormData | null;
  title: string;
}

const currencyOptions = ["IDR", "USD", "EUR"];
const jenisDokumenOptions = [
  "PO Barang",
  "PO Jasa",
  "Uang Muka",
  "LPB (Lembar Penerimaan Barang)",
  "Voucher",
  "Reimburse",
];

const dibayarkanKepadaOptions = [
  "Supplier",
  "Karyawan",
  "Vendor",
  "Kontraktor",
  "Lainnya",
];

// Sample employee data with account numbers
const employeeData = [
  { name: "Andi Pratama", accountNumber: "1234567890" },
  { name: "Siti Nurhaliza", accountNumber: "2345678901" },
  { name: "Rudi Hermawan", accountNumber: "3456789012" },
  { name: "Maya Sari", accountNumber: "4567890123" },
  { name: "Budi Santoso", accountNumber: "5678901234" },
];

const FinancePermintaanPencairanDanaModal: React.FC<
  FinancePermintaanPencairanDanaModalProps
> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const today = new Date();
  const divisiOptions = [
    "Marketing",
    "HRD",
    "GA",
    "Procurement",
    "Project Control",
    "Operasional",
    "QHSE",
    "Finance",
    "Accounting",
    "Tax",
    "Gudang",
  ];

  const initialEmpty: PermintaanPencairanDanaFormData = {
    noPPD: `PPD-${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-001`,
    tglPPDFrom: today,
    tglPPDTo: today,
    divisi: "",
    namaPemohon: "",
    mataUang: "IDR",
    statusLunas: "Belum",
    pertanggungjawaban: "Tidak",
    jenisDokumen: "",
    detailItems: [
      { id: 1, noDokumen: "", keterangan: "", dibayarkanKepada: "", namaPenerima: "", noRekening: "", nominalDPP: 0, nominalPPN: 0 },
    ],
    totalPembayaran: 0,
  };

  const [formData, setFormData] =
    useState<PermintaanPencairanDanaFormData>(initialEmpty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      setFormData(
        initialData
          ? {
              ...initialData,
              tglPPDFrom: initialData.tglPPDFrom
                ? new Date(initialData.tglPPDFrom)
                : today,
              tglPPDTo: initialData.tglPPDTo
                ? new Date(initialData.tglPPDTo)
                : today,
              totalPembayaran: calcTotal(initialData.detailItems),
            }
          : initialEmpty
      );
      setErrors({});
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      setFormData(initialEmpty);
      setErrors({});
    };
  }, [isOpen, onClose, initialData]);

  const calcTotal = (items: PPDDetailItem[]) =>
    items.reduce(
      (sum, it) =>
        sum + (Number(it.nominalDPP) || 0) + (Number(it.nominalPPN) || 0),
      0
    );

  const handleAddRow = () =>
    setFormData((prev) => ({
      ...prev,
      detailItems: [
        ...prev.detailItems,
        {
          id: prev.detailItems.length + 1,
          noDokumen: "",
          keterangan: "",
          dibayarkanKepada: "",
          namaPenerima: "",
          noRekening: "",
          nominalDPP: 0,
          nominalPPN: 0,
        },
      ],
      totalPembayaran: calcTotal(prev.detailItems),
    }));
  const handleRemoveRow = (id: number) =>
    setFormData((prev) => {
      const updated = prev.detailItems.filter((it) => it.id !== id);
      return {
        ...prev,
        detailItems: updated,
        totalPembayaran: calcTotal(updated),
      };
    });

  const handleDetailChange = (
    id: number,
    field: keyof PPDDetailItem,
    value: any
  ) => {
    setFormData((prev) => {
      const updated = prev.detailItems.map((it) =>
        it.id === id ? { ...it, [field]: value } : it
      );
      return {
        ...prev,
        detailItems: updated,
        totalPembayaran: calcTotal(updated),
      };
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.noPPD.trim()) e.noPPD = "No PPD wajib diisi";
    if (!formData.tglPPDFrom || !formData.tglPPDTo)
      e.tglPPDFrom = "Periode tanggal wajib diisi";
    if (!formData.divisi.trim()) e.divisi = "Divisi wajib dipilih";
    if (!formData.namaPemohon.trim())
      e.namaPemohon = "Nama pemohon wajib diisi";
    if (formData.detailItems.length === 0)
      e.detailItems = "Minimal satu baris detail diperlukan";
    else
      formData.detailItems.forEach((it, idx) => {
        if (!it.noDokumen.trim())
          e[`detailItems[${idx}].noDokumen`] = "No. Dokumen wajib diisi";
        if (!it.dibayarkanKepada.trim())
          e[`detailItems[${idx}].dibayarkanKepada`] = "Wajib diisi";
        if (!it.namaPenerima.trim())
          e[`detailItems[${idx}].namaPenerima`] = "Wajib diisi";
        if (!it.noRekening.trim())
          e[`detailItems[${idx}].noRekening`] = "Wajib diisi";
        const subtotal =
          (Number(it.nominalDPP) || 0) + (Number(it.nominalPPN) || 0);
        if (!subtotal || subtotal <= 0)
          e[`detailItems[${idx}].subtotal`] = "Subtotal harus > 0";
      });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({ ...formData, totalPembayaran: calcTotal(formData.detailItems) });
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. PPD <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.noPPD}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, noPPD: e.target.value }))
                  }
                  className={`block w-full border rounded-lg px-4 py-2 text-sm ${
                    errors.noPPD ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.noPPD && (
                  <p className="mt-1 text-sm text-red-600">{errors.noPPD}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tgl PPD (Dari) <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formData.tglPPDFrom}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({ ...prev, tglPPDFrom: date }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`block w-full border rounded-lg px-4 py-2 text-sm ${
                      errors.tglPPDFrom ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tgl PPD (Sampai) <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formData.tglPPDTo}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({ ...prev, tglPPDTo: date }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`block w-full border rounded-lg px-4 py-2 text-sm ${
                      errors.tglPPDFrom ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Divisi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.divisi}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, divisi: e.target.value }))
                  }
                  className={`block w-full border rounded-lg px-4 py-2 text-sm appearance-none ${
                    errors.divisi ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Pilih Divisi</option>
                  {divisiOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.divisi && (
                  <p className="mt-1 text-sm text-red-600">{errors.divisi}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pemohon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaPemohon}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      namaPemohon: e.target.value,
                    }))
                  }
                  className={`block w-full border rounded-lg px-4 py-2 text-sm ${
                    errors.namaPemohon ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.namaPemohon && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.namaPemohon}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mata Uang
                </label>
                <select
                  value={formData.mataUang}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mataUang: e.target.value,
                    }))
                  }
                  className="block w-full border rounded-lg px-4 py-2 text-sm appearance-none"
                >
                  {currencyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Lunas
                </label>
                <select
                  value={formData.statusLunas}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      statusLunas: e.target.value as "Lunas" | "Belum",
                    }))
                  }
                  className="block w-full border rounded-lg px-4 py-2 text-sm appearance-none"
                >
                  <option value="Belum">Belum</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pertanggungjawaban <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.pertanggungjawaban}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pertanggungjawaban: e.target.value as "Iya" | "Tidak",
                    }))
                  }
                  className="block w-full border rounded-lg px-4 py-2 text-sm appearance-none"
                >
                  <option value="Tidak">Tidak</option>
                  <option value="Iya">Iya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Dokumen
                </label>
                <select
                  value={formData.jenisDokumen}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      jenisDokumen: e.target.value,
                    }))
                  }
                  className="block w-full border rounded-lg px-4 py-2 text-sm appearance-none"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  {jenisDokumenOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-800">Detail Dokumen</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dibayarkan Kepada</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Penerima</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. Rekening</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Nominal DPP</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Nominal PPN</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">SubTotal</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.detailItems.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={it.noDokumen}
                          onChange={(e) =>
                            handleDetailChange(
                              it.id,
                              "noDokumen",
                              e.target.value
                            )
                          }
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${
                            errors[`detailItems[${idx}].noDokumen`]
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="No. Dokumen"
                        />
                        {errors[`detailItems[${idx}].noDokumen`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`detailItems[${idx}].noDokumen`]}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={it.keterangan}
                          onChange={(e) =>
                            handleDetailChange(
                              it.id,
                              "keterangan",
                              e.target.value
                            )
                          }
                          className="block w-full border rounded-lg px-2 py-1.5 text-sm border-gray-300"
                          placeholder="Keterangan"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={it.dibayarkanKepada}
                          onChange={(e) => handleDetailChange(it.id, "dibayarkanKepada", e.target.value)}
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm appearance-none ${
                            errors[`detailItems[${idx}].dibayarkanKepada`] ? "border-red-300" : "border-gray-300" }`}>
                          <option value="">Pilih</option>
                          {dibayarkanKepadaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {it.dibayarkanKepada === 'Karyawan' ? (
                          <select
                            value={it.namaPenerima}
                            onChange={(e) => {
                              const employee = employeeData.find(emp => emp.name === e.target.value);
                              handleDetailChange(it.id, "namaPenerima", e.target.value);
                              if (employee) {
                                handleDetailChange(it.id, "noRekening", employee.accountNumber);
                              }
                            }}
                            className={`block w-full border rounded-lg px-2 py-1.5 text-sm appearance-none ${
                              errors[`detailItems[${idx}].namaPenerima`] ? "border-red-300" : "border-gray-300" }`}>
                            <option value="">Pilih Karyawan</option>
                            {employeeData.map(emp => <option key={emp.name} value={emp.name}>{emp.name}</option>)}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={it.namaPenerima}
                            onChange={(e) => handleDetailChange(it.id, "namaPenerima", e.target.value)}
                            className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${
                              errors[`detailItems[${idx}].namaPenerima`] ? "border-red-300" : "border-gray-300" }`}
                            placeholder="Nama Penerima" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={it.noRekening}
                          onChange={(e) => handleDetailChange(it.id, "noRekening", e.target.value)}
                          readOnly={it.dibayarkanKepada === 'Karyawan' && it.namaPenerima !== ''}
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${
                            errors[`detailItems[${idx}].noRekening`] ? "border-red-300" : "border-gray-300" }`}
                          placeholder="No. Rekening" />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={it.nominalDPP}
                          onChange={(e) =>
                            handleDetailChange(
                              it.id,
                              "nominalDPP",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${
                            errors[`detailItems[${idx}].subtotal`]
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={it.nominalPPN}
                          onChange={(e) =>
                            handleDetailChange(
                              it.id,
                              "nominalPPN",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${
                            errors[`detailItems[${idx}].subtotal`]
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        Rp{" "}
                        {(
                          (it.nominalDPP || 0) + (it.nominalPPN || 0)
                        ).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(it.id)}
                          className="inline-flex items-center px-2 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Baris
              </button>
              <div className="text-lg font-bold text-gray-900">
                Total pembayaran: Rp{" "}
                {formData.totalPembayaran.toLocaleString("id-ID")}
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Tutup
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm inline-flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancePermintaanPencairanDanaModal;
