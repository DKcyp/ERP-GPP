import React, { useEffect, useState } from "react";
import { X, Save, CalendarDays } from "lucide-react";

export interface TrackingDokumenData {
  id: string;
  no: number;
  tglPembuatanPR: string;
  noPR: string;
  tglPenerimaanPR: string;
  namaSupplier: string;
  tglPO: string;
  noPO: string;
  noSO: string;
  nilaiDPP: string;
  nilaiPPN: string;
  subTotal: string;
  noInvoice: string;
  tglInvoice: string;
  noFakturPajak: string;
  tglFakturPajak: string;
  tglTerimaBarang: string;
  noLPB: string;
  tglTerimaKeuangan: string;
  tglPengajuanDana: string;
  tglBayar: string;
  noBuktiBayar: string;
  status: "Ontime" | "Late";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TrackingDokumenData, "id" | "no">) => void;
  initial?: TrackingDokumenData | null;
}

const TrackingDokumenFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initial }) => {
  const [form, setForm] = useState<Omit<TrackingDokumenData, "id" | "no">>({
    tglPembuatanPR: "",
    noPR: "",
    tglPenerimaanPR: "",
    namaSupplier: "",
    tglPO: "",
    noPO: "",
    noSO: "",
    nilaiDPP: "",
    nilaiPPN: "",
    subTotal: "",
    noInvoice: "",
    tglInvoice: "",
    noFakturPajak: "",
    tglFakturPajak: "",
    tglTerimaBarang: "",
    noLPB: "",
    tglTerimaKeuangan: "",
    tglPengajuanDana: "",
    tglBayar: "",
    noBuktiBayar: "",
    status: "Ontime",
  });

  useEffect(() => {
    if (isOpen && initial) {
      const { id, no, ...rest } = initial;
      setForm(rest);
    }
    if (isOpen && !initial) {
      setForm((prev) => ({ ...prev, status: "Ontime" }));
    }
  }, [isOpen, initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as any;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  const LabeledInput: React.FC<{
    label: string;
    name: keyof typeof form;
    type?: string;
    placeholder?: string;
  }> = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={(form[name] as string) || ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs pr-9"
        />
        {(type === "date" || String(name).toLowerCase().includes("tgl")) && (
          <CalendarDays className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow w-full max-w-5xl">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-sm font-semibold">Form Tracking Dokumen</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LabeledInput label="Tgl Pembuatan PR" name="tglPembuatanPR" type="date" />
            <LabeledInput label="No.PR" name="noPR" />
            <LabeledInput label="Tgl Penerimaan PR" name="tglPenerimaanPR" type="date" />
            <LabeledInput label="Nama Supplier/Vendor" name="namaSupplier" />
            <LabeledInput label="Tgl PO" name="tglPO" type="date" />
            <LabeledInput label="No. PO (PO Jasa / Barang)" name="noPO" />
            <LabeledInput label="No.SO" name="noSO" />
            <LabeledInput label="Nilai DPP" name="nilaiDPP" placeholder="Rp 0" />
            <LabeledInput label="Nilai PPN" name="nilaiPPN" placeholder="Rp 0" />
            <LabeledInput label="SubTotal" name="subTotal" placeholder="Rp 0" />
            <LabeledInput label="No.Invoice" name="noInvoice" />
            <LabeledInput label="Tgl Invoice" name="tglInvoice" type="date" />
            <LabeledInput label="No Faktur Pajak" name="noFakturPajak" />
            <LabeledInput label="Tgl Faktur Pajak" name="tglFakturPajak" type="date" />
            <LabeledInput label="Tgl Terima Barang" name="tglTerimaBarang" type="date" />
            <LabeledInput label="No.LPB (Lembar Penerimaan Barang)" name="noLPB" />
            <LabeledInput label="Tgl Terima Keuangan" name="tglTerimaKeuangan" type="date" />
            <LabeledInput label="Tgl Pengajuan Dana" name="tglPengajuanDana" type="date" />
            <LabeledInput label="Tgl Bayar" name="tglBayar" type="date" />
            <LabeledInput label="No.Bukti Bayar" name="noBuktiBayar" />
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
              >
                <option value="Ontime">Ontime</option>
                <option value="Late">Late</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs rounded-md border">Batal</button>
            <button type="submit" className="px-3 py-1.5 text-xs rounded-md bg-green-600 text-white flex items-center gap-1">
              <Save className="h-4 w-4" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackingDokumenFormModal;
