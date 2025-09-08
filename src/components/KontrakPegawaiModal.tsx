import React, { useEffect, useState } from "react";

export interface KontrakPegawaiFormData {
  statusKontrakPajak:
    | "Tenaga Ahli/Freelance"
    | "PKWT/Kontrak"
    | "PKWTT/Tetap"
    | string;
  joinDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  renewalKontrak: string; // free text or YYYY-MM-DD if date
}

interface KontrakPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KontrakPegawaiFormData) => void;
  initialData?: Partial<KontrakPegawaiFormData> | null;
  readOnly?: boolean;
}

const defaultForm: KontrakPegawaiFormData = {
  statusKontrakPajak: "PKWT/Kontrak",
  joinDate: "",
  startDate: "",
  endDate: "",
  renewalKontrak: "",
};

const KontrakPegawaiModal: React.FC<KontrakPegawaiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  readOnly,
}) => {
  const [form, setForm] = useState<KontrakPegawaiFormData>(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultForm, ...initialData } as KontrakPegawaiFormData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
            {readOnly
              ? "Detail Kontrak Pegawai"
              : initialData
              ? "Edit Kontrak Pegawai"
              : "Tambah Kontrak Pegawai"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status kontrak untuk pajak
              </label>
              <select
                name="statusKontrakPajak"
                value={form.statusKontrakPajak}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-white"
              >
                <option value="Tenaga Ahli/Freelance">
                  Tenaga Ahli/Freelance
                </option>
                <option value="PKWT/Kontrak">PKWT/Kontrak</option>
                <option value="PKWTT/Tetap">PKWTT/Tetap</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Join date
              </label>
              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start date kontrak aktif
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End date kontrak aktif
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Renewal kontrak
              </label>
              <input
                type="text"
                name="renewalKontrak"
                value={form.renewalKontrak}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                placeholder="Catatan/perpanjangan"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-2 -mx-6 -mb-5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Tutup
            </button>
            {!readOnly && (
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md text-sm bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Simpan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default KontrakPegawaiModal;
