import React, { useEffect, useState } from 'react';

export interface SuportOperasionalForm {
  tanggal: string; // yyyy-mm-dd
  departemen: string;
  kebutuhan: string; // e.g., Pengadaan, Perbaikan, Fasilitas
  deskripsi: string;
  pic: string; // penanggung jawab
  prioritas: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Done' | 'Cancelled';
  targetSelesai: string; // yyyy-mm-dd
  hasil?: string;
}

interface SuportOperasionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SuportOperasionalForm) => void;
  initialData?: SuportOperasionalForm | null;
  title?: string;
  submitLabel?: string;
}

const SuportOperasionalModal: React.FC<SuportOperasionalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Suport Operasional',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<SuportOperasionalForm>({
    tanggal: '',
    departemen: '',
    kebutuhan: '',
    deskripsi: '',
    pic: '',
    prioritas: 'Medium',
    status: 'Open',
    targetSelesai: '',
    hasil: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          tanggal: '',
          departemen: '',
          kebutuhan: '',
          deskripsi: '',
          pic: '',
          prioritas: 'Medium',
          status: 'Open',
          targetSelesai: '',
          hasil: '',
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
    if (!form.tanggal || !form.departemen.trim() || !form.kebutuhan.trim() || !form.deskripsi.trim() || !form.pic.trim()) return;
    onSave({
      ...form,
      departemen: form.departemen.trim(),
      kebutuhan: form.kebutuhan.trim(),
      deskripsi: form.deskripsi.trim(),
      pic: form.pic.trim(),
      hasil: form.hasil?.trim(),
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <input name="departemen" value={form.departemen} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: HRD / Finance" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIC</label>
              <input name="pic" value={form.pic} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Penanggung jawab" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan</label>
              <input name="kebutuhan" value={form.kebutuhan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Pengadaan/Perbaikan/Fasilitas" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
              <select name="prioritas" value={form.prioritas} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Selesai</label>
              <input type="date" name="targetSelesai" value={form.targetSelesai} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Detail kebutuhan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasil</label>
            <textarea name="hasil" value={form.hasil} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Diisi setelah selesai" />
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

export default SuportOperasionalModal;
