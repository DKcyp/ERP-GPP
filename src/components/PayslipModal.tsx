import React, { useEffect, useState } from "react";
import { X, Save, Loader2, Calendar } from "lucide-react";

export interface PayslipFormData {
  id?: string;
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  periode: string; // YYYY-MM
  totalIncome: string; // Rp formatted
  totalDeduct: string; // Rp formatted
  gajiBersih: string; // Rp formatted (auto)
  keterangan?: string;
}

const pegawaiMapping: Record<string, string> = {
  EMP001: "Ahmad Fauzi",
  EMP002: "Siti Nurhaliza",
  EMP003: "Budi Santoso",
  EMP004: "Dewi Lestari",
  EMP005: "Rizki Pratama",
};

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayslipFormData) => void;
  initialData?: PayslipFormData | null;
}

const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState<PayslipFormData>({
    kodePegawai: "",
    namaPegawai: "",
    jenisPegawai: "",
    periode: "",
    totalIncome: "",
    totalDeduct: "",
    gajiBersih: "",
    keterangan: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PayslipFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const formatRp = (value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    return numeric ? `Rp ${parseInt(numeric, 10).toLocaleString("id-ID")}` : "";
  };
  const toNumber = (rp: string) => parseFloat(rp.replace(/[^\d]/g, "")) || 0;

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ kodePegawai: "", namaPegawai: "", jenisPegawai: "", periode: "", totalIncome: "", totalDeduct: "", gajiBersih: "", keterangan: "" });
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const income = toNumber(form.totalIncome);
    const deduct = toNumber(form.totalDeduct);
    const bersih = Math.max(income - deduct, 0);
    setForm(prev => ({ ...prev, gajiBersih: bersih ? `Rp ${bersih.toLocaleString("id-ID")}` : "" }));
  }, [form.totalIncome, form.totalDeduct]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const validate = () => {
    const e: Partial<Record<keyof PayslipFormData, string>> = {};
    if (!form.kodePegawai) e.kodePegawai = "Kode Pegawai wajib dipilih";
    if (!form.jenisPegawai) e.jenisPegawai = "Jenis Pegawai wajib dipilih";
    if (!form.periode) e.periode = "Periode wajib diisi";
    if (!form.totalIncome) e.totalIncome = "Total Income wajib diisi";
    if (!form.totalDeduct) e.totalDeduct = "Total Deduct wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave(form);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Payslip" : "Tambah Payslip"}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pegawai <span className="text-red-500">*</span></label>
                <select
                  value={form.kodePegawai}
                  onChange={(e) => setForm(prev => ({ ...prev, kodePegawai: e.target.value, namaPegawai: pegawaiMapping[e.target.value] || "" }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.kodePegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                >
                  <option value="">Pilih Kode Pegawai</option>
                  {Object.keys(pegawaiMapping).map(k => (<option key={k} value={k}>{k}</option>))}
                </select>
                {errors.kodePegawai && <p className="mt-1 text-sm text-red-600">{errors.kodePegawai}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
                <input type="text" value={form.namaPegawai} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pegawai <span className="text-red-500">*</span></label>
                <select
                  value={form.jenisPegawai}
                  onChange={(e) => setForm(prev => ({ ...prev, jenisPegawai: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.jenisPegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                >
                  <option value="">Pilih Jenis Pegawai</option>
                  <option value="Tetap">Tetap</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Magang">Magang</option>
                </select>
                {errors.jenisPegawai && <p className="mt-1 text-sm text-red-600">{errors.jenisPegawai}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Periode (YYYY-MM) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="month" value={form.periode} onChange={(e) => setForm(prev => ({ ...prev, periode: e.target.value }))} className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.periode ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.periode && <p className="mt-1 text-sm text-red-600">{errors.periode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Income <span className="text-red-500">*</span></label>
                <input type="text" value={form.totalIncome} onChange={(e) => setForm(prev => ({ ...prev, totalIncome: formatRp(e.target.value) }))} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.totalIncome ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.totalIncome && <p className="mt-1 text-sm text-red-600">{errors.totalIncome}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Deduct <span className="text-red-500">*</span></label>
                <input type="text" value={form.totalDeduct} onChange={(e) => setForm(prev => ({ ...prev, totalDeduct: formatRp(e.target.value) }))} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.totalDeduct ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.totalDeduct && <p className="mt-1 text-sm text-red-600">{errors.totalDeduct}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gaji Bersih</label>
                <input type="text" value={form.gajiBersih} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700" placeholder="Rp 0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <input type="text" value={form.keterangan || ""} onChange={(e) => setForm(prev => ({ ...prev, keterangan: e.target.value }))} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 border-gray-200" placeholder="Opsional" />
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm">Close</button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 text-sm">
            {isLoading ? (<><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Saving...</span></>) : (<><Save className="h-3.5 w-3.5" /><span>Simpan</span></>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;
