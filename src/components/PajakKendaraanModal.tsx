import React, { useEffect, useState } from 'react';

export interface PajakKendaraanForm {
  merek: string;
  platNomor: string;
  jatuhTempo: string; // yyyy-mm-dd
  status: 'Lunas' | 'Belum Lunas';
  keterangan?: string;
}

interface PajakKendaraanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PajakKendaraanForm) => void;
  initialData?: PajakKendaraanForm | null;
  title?: string;
  submitLabel?: string;
}

const PajakKendaraanModal: React.FC<PajakKendaraanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Pajak Kendaraan',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<PajakKendaraanForm>({
    merek: '',
    platNomor: '',
    jatuhTempo: '',
    status: 'Belum Lunas',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          merek: '',
          platNomor: '',
          jatuhTempo: '',
          status: 'Belum Lunas',
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
    if (!form.merek.trim() || !form.platNomor.trim() || !form.jatuhTempo) return;
    onSave({ ...form, merek: form.merek.trim(), platNomor: form.platNomor.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
              <input
                name="merek"
                value={form.merek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Expander"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
              <input
                name="platNomor"
                value={form.platNomor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: B 1875 ROB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
              <input
                type="date"
                name="jatuhTempo"
                value={form.jatuhTempo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Lunas">Lunas</option>
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PajakKendaraanModal;
