import React, { useEffect, useState } from 'react';

export interface SaprasForm {
  namaAset: string;
  kategori: 'Gedung' | 'Kendaraan' | 'Peralatan' | 'IT' | 'Lainnya';
  lokasi: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  jadwalService: string; // yyyy-mm-dd
  statusService: 'Scheduled' | 'Done' | 'Overdue';
  keterangan?: string;
}

interface GASaranaPrasaranaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SaprasForm) => void;
  initialData?: SaprasForm | null;
  title?: string;
  submitLabel?: string;
}

const GASaranaPrasaranaModal: React.FC<GASaranaPrasaranaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Sarana/Prasarana',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<SaprasForm>({
    namaAset: '',
    kategori: 'Lainnya',
    lokasi: '',
    kondisi: 'Baik',
    jadwalService: '',
    statusService: 'Scheduled',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          namaAset: '',
          kategori: 'Lainnya',
          lokasi: '',
          kondisi: 'Baik',
          jadwalService: '',
          statusService: 'Scheduled',
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
    if (!form.namaAset.trim() || !form.lokasi.trim() || !form.jadwalService) return;
    onSave({ ...form, namaAset: form.namaAset.trim(), lokasi: form.lokasi.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Gedung">Gedung</option>
                <option value="Kendaraan">Kendaraan</option>
                <option value="Peralatan">Peralatan</option>
                <option value="IT">IT</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Kantor Pusat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
              <select
                name="kondisi"
                value={form.kondisi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal Service</label>
              <input
                type="date"
                name="jadwalService"
                value={form.jadwalService}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Service</label>
              <select
                name="statusService"
                value={form.statusService}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Done">Done</option>
                <option value="Overdue">Overdue</option>
              </select>
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

export default GASaranaPrasaranaModal;
