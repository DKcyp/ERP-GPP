import React, { useEffect, useState } from 'react';

export interface PajakKendaraanForm {
  merek: string;
  platNomor: string;
  jatuhTempo: string; // yyyy-mm-dd
  status: 'Lunas' | 'Belum Lunas';
  keterangan?: string;
  uploads?: { name: string; size: number }[]; // metadata dokumen ter-upload
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
    uploads: [],
  });

  // Opsi kendaraan (dummy) - bisa disinkronkan dengan Master Kendaraan bila diperlukan
  const kendaraanOptions = [
    { merek: 'Expander', platNomor: 'B 1875 ROB' },
    { merek: 'Expander', platNomor: 'B 1079 ROJ' },
    { merek: 'Expander', platNomor: 'B 1044 ROR' },
    { merek: 'Rubicon', platNomor: 'B 500 GBP' },
    { merek: 'Rubicon', platNomor: 'B 2141 UZT' },
    { merek: 'Chery', platNomor: 'B 1753 TNT' },
    { merek: 'Chery', platNomor: 'Triton 9319 TBB' },
  ];

  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          merek: '',
          platNomor: '',
          jatuhTempo: '',
          status: 'Belum Lunas',
          keterangan: '',
          uploads: [],
        }
      );
      // Set selected vehicle berdasarkan data awal (edit)
      if (initialData?.merek && initialData?.platNomor) {
        setSelectedVehicle(`${initialData.merek} | ${initialData.platNomor}`);
      } else {
        setSelectedVehicle('');
      }
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
    onSave({ ...form, merek: form.merek.trim(), platNomor: form.platNomor.trim(), uploads: form.uploads ?? [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Pilih Kendaraan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kendaraan</label>
            <select
              value={selectedVehicle}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedVehicle(val);
                const [m, p] = val.split(' | ');
                if (m && p) setForm((prev) => ({ ...prev, merek: m, platNomor: p }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">-- Pilih Kendaraan --</option>
              {kendaraanOptions.map((opt) => {
                const key = `${opt.merek} | ${opt.platNomor}`;
                return (
                  <option key={key} value={key}>{opt.merek} - {opt.platNomor}</option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">Merek dan plat nomor akan terisi otomatis berdasarkan pilihan.</p>
          </div>

          {/* Tampilkan Merek & Plat (read-only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
              <input value={form.merek} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
              <input value={form.platNomor} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
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

          {/* Upload Dokumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumen (opsional)</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const meta = files.map((f) => ({ name: f.name, size: f.size }));
                setForm((prev) => ({ ...prev, uploads: [...(prev.uploads || []), ...meta] }));
              }}
              className="block w-full text-sm text-gray-700"
            />
            {!!(form.uploads && form.uploads.length) && (
              <ul className="mt-2 space-y-1 text-xs text-gray-700">
                {form.uploads!.map((u, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>• {u.name} <span className="text-gray-400">({Math.round(u.size / 1024)} KB)</span></span>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => setForm((prev) => ({ ...prev, uploads: prev.uploads?.filter((_, i) => i !== idx) }))}
                    >Hapus</button>
                  </li>
                ))}
              </ul>
            )}
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
