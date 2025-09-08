import React, { useEffect, useState } from 'react';

export interface KebersihanLingkunganForm {
  tanggal: string; // yyyy-mm-dd
  area: string; // area/ruangan/lantai
  aktivitas: string; // kegiatan kebersihan
  petugas: string; // PIC / vendor
  status: 'Scheduled' | 'In Progress' | 'Done' | 'Overdue';
  skor?: string; // penilaian kualitas (opsional)
  catatan?: string;
}

interface KebersihanLingkunganModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KebersihanLingkunganForm) => void;
  initialData?: KebersihanLingkunganForm | null;
  title?: string;
  submitLabel?: string;
}

const KebersihanLingkunganModal: React.FC<KebersihanLingkunganModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Kegiatan Kebersihan',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<KebersihanLingkunganForm>({
    tanggal: '',
    area: '',
    aktivitas: '',
    petugas: '',
    status: 'Scheduled',
    skor: '',
    catatan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          tanggal: '',
          area: '',
          aktivitas: '',
          petugas: '',
          status: 'Scheduled',
          skor: '',
          catatan: '',
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
    if (!form.tanggal || !form.area.trim() || !form.aktivitas.trim() || !form.petugas.trim()) return;
    onSave({
      ...form,
      area: form.area.trim(),
      aktivitas: form.aktivitas.trim(),
      petugas: form.petugas.trim(),
      skor: form.skor?.trim(),
      catatan: form.catatan?.trim(),
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Area/Ruangan</label>
              <input name="area" value={form.area} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Lantai 2 / Lobby / Toilet" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas</label>
              <input name="aktivitas" value={form.aktivitas} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Pengepelan, Pembersihan kaca, Disinfeksi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Petugas/Vendor</label>
              <input name="petugas" value={form.petugas} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama petugas atau vendor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skor (Opsional)</label>
              <input name="skor" value={form.skor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Mis. 95/100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea name="catatan" value={form.catatan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Opsional" />
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

export default KebersihanLingkunganModal;
