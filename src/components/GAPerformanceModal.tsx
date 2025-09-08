import React, { useEffect, useState } from 'react';

export interface GAPerformanceForm {
  indikator: string;
  target: string; // e.g., 95%
  realisasi: string; // e.g., 90%
  periode: string; // yyyy-mm
  kategori: 'Legalitas' | 'Sarana & Prasarana' | 'Operasional' | 'IT' | 'ATK' | 'Lainnya';
  keterangan?: string;
}

interface GAPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GAPerformanceForm) => void;
  initialData?: GAPerformanceForm | null;
  title?: string;
  submitLabel?: string;
}

const GAPerformanceModal: React.FC<GAPerformanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah GA Performance',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<GAPerformanceForm>({
    indikator: '',
    target: '',
    realisasi: '',
    periode: '',
    kategori: 'Lainnya',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          indikator: '',
          target: '',
          realisasi: '',
          periode: '',
          kategori: 'Lainnya',
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
    if (!form.indikator.trim() || !form.target.trim() || !form.realisasi.trim() || !form.periode) return;
    onSave({ ...form, indikator: form.indikator.trim(), target: form.target.trim(), realisasi: form.realisasi.trim() });
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Indikator</label>
              <input
                name="indikator"
                value={form.indikator}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: SLA penanganan tiket"
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
                <option value="Legalitas">Legalitas</option>
                <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                <option value="Operasional">Operasional</option>
                <option value="IT">IT</option>
                <option value="ATK">ATK</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input
                name="target"
                value={form.target}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: 95%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Realisasi</label>
              <input
                name="realisasi"
                value={form.realisasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: 90%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <input
                type="month"
                name="periode"
                value={form.periode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

export default GAPerformanceModal;
