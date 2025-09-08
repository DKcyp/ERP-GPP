import React, { useEffect, useState } from "react";

export interface ReqManPowerFormData {
  departemen: string;
  posisi: string;
  tanggalReq: string; // YYYY-MM-DD
  kualifikasi: string;
  approvalDireksi: "Pending" | "Approved" | "Rejected";
  approvalHead: "Pending" | "Approved" | "Rejected";
}

interface ReqManPowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReqManPowerFormData) => void;
  initialData?: Partial<ReqManPowerFormData> | null;
  readOnly?: boolean;
}

const defaultForm: ReqManPowerFormData = {
  departemen: "",
  posisi: "",
  tanggalReq: "",
  kualifikasi: "",
  approvalDireksi: "Pending",
  approvalHead: "Pending",
};

const ReqManPowerModal: React.FC<ReqManPowerModalProps> = ({ isOpen, onClose, onSave, initialData, readOnly }) => {
  const [form, setForm] = useState<ReqManPowerFormData>(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...defaultForm,
        ...initialData,
      } as ReqManPowerFormData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {readOnly ? "Detail REQ Man Power" : initialData ? "Edit REQ Man Power" : "Tambah REQ Man Power"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Departemen</label>
              <input
                type="text"
                name="departemen"
                value={form.departemen}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                placeholder="HRD / Operasional / Finance"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Posisi</label>
              <input
                type="text"
                name="posisi"
                value={form.posisi}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                placeholder="Supervisor / Staff / Teknisi"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Req</label>
              <input
                type="date"
                name="tanggalReq"
                value={form.tanggalReq}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kualifikasi</label>
              <textarea
                name="kualifikasi"
                value={form.kualifikasi}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm min-h-[92px]"
                placeholder="Minimal D3, pengalaman 2 tahun, dll"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Approval Direksi</label>
              <select
                name="approvalDireksi"
                value={form.approvalDireksi}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Approval Head Dept</label>
              <select
                name="approvalHead"
                value={form.approvalHead}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700">Tutup</button>
            {!readOnly && (
              <button type="submit" className="px-3 py-1.5 rounded-md text-sm bg-cyan-600 hover:bg-cyan-700 text-white">Simpan</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReqManPowerModal;
