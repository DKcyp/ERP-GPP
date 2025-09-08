import React, { useEffect, useState } from 'react';

export interface MaintenanceSaprasForm {
  namaAset: string;
  lokasi: string;
  jenisPekerjaan: string;
  tanggalMulai: string; // yyyy-mm-dd
  tanggalSelesai: string; // yyyy-mm-dd
  vendor: string;
  status: 'Scheduled' | 'In Progress' | 'Done' | 'Overdue';
  biaya: string; // currency text
  keterangan?: string;
}

interface MaintenanceSaprasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MaintenanceSaprasForm) => void;
  initialData?: MaintenanceSaprasForm | null;
  title?: string;
  submitLabel?: string;
}

const MaintenanceSaprasModal: React.FC<MaintenanceSaprasModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Maintenance',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<MaintenanceSaprasForm>({
    namaAset: '',
    lokasi: '',
    jenisPekerjaan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    vendor: '',
    status: 'Scheduled',
    biaya: '',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          namaAset: '',
          lokasi: '',
          jenisPekerjaan: '',
          tanggalMulai: '',
          tanggalSelesai: '',
          vendor: '',
          status: 'Scheduled',
          biaya: '',
          keterangan: '',
        }
      );
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaAset.trim() || !form.lokasi.trim() || !form.jenisPekerjaan.trim() || !form.tanggalMulai) return;
    onSave({
      ...form,
      namaAset: form.namaAset.trim(),
      lokasi: form.lokasi.trim(),
      jenisPekerjaan: form.jenisPekerjaan.trim(),
      vendor: form.vendor.trim(),
      biaya: form.biaya.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aset</label>
              <input
                name="namaAset"
                value={form.namaAset}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: AC Lantai 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kantor Pusat"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pekerjaan</label>
              <input
                name="jenisPekerjaan"
                value={form.jenisPekerjaan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Perawatan berkala / Perbaikan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                name="tanggalMulai"
                value={form.tanggalMulai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                name="tanggalSelesai"
                value={form.tanggalSelesai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama vendor/bengkel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
              <input
                name="biaya"
                value={form.biaya}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 2.500.000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Opsional"
            />
          </div>
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceSaprasModal;
