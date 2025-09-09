import React, { useEffect, useState } from "react";

export interface MonitoringKontrakFormData {
  namaKaryawan: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  attachmentKontrak: File | null;
}

interface MonitoringKontrakPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MonitoringKontrakFormData) => void;
  initialData?: Partial<MonitoringKontrakFormData> | null;
  readOnly?: boolean;
}

const defaultForm: MonitoringKontrakFormData = {
  namaKaryawan: "",
  startDate: "",
  endDate: "",
  attachmentKontrak: null,
};

const MonitoringKontrakPegawaiModal: React.FC<
  MonitoringKontrakPegawaiModalProps
> = ({ isOpen, onClose, onSave, initialData, readOnly }) => {
  const [form, setForm] = useState<MonitoringKontrakFormData>(defaultForm);

  useEffect(() => {
    if (isOpen)
      setForm({ ...defaultForm, ...initialData } as MonitoringKontrakFormData);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "attachmentKontrak") {
      setForm((p) => ({
        ...p,
        attachmentKontrak: files && files[0] ? files[0] : null,
      }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
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
              ? "Detail Monitoring Kontrak"
              : initialData
              ? "Edit Monitoring Kontrak"
              : "Tambah Monitoring Kontrak"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Data Karyawan
              </label>
              <input
                type="text"
                name="namaKaryawan"
                value={form.namaKaryawan}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                placeholder="Nama Karyawan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Attachment Kontrak
              </label>
              <input
                type="file"
                name="attachmentKontrak"
                onChange={handleChange}
                disabled={!!readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
              {form.attachmentKontrak && (
                <p className="mt-1 text-xs text-gray-500">
                  Terpilih: {form.attachmentKontrak.name}
                </p>
              )}
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

export default MonitoringKontrakPegawaiModal;
