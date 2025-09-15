import React, { useEffect, useState } from 'react';

export interface LegalitasForm {
  jenisDokumen: string;
  noDokumen: string;
  tanggalMulai: string; // yyyy-mm-dd
  tanggalBerakhir: string; // yyyy-mm-dd
  status: 'Pengajuan' | 'Proses' | 'Selesai';
  penerbit: string;
  keterangan?: string;
  dokumenUrl?: string; // object URL for uploaded file (local demo)
  dokumenName?: string;
}

interface LegalitasPerusahaanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LegalitasForm) => void;
  initialData?: LegalitasForm | null;
  title?: string;
  submitLabel?: string;
}

const LegalitasPerusahaanModal: React.FC<LegalitasPerusahaanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Legalitas',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<LegalitasForm>({
    jenisDokumen: '',
    noDokumen: '',
    tanggalMulai: '',
    tanggalBerakhir: '',
    status: 'Pengajuan',
    penerbit: '',
    keterangan: '',
    dokumenUrl: '',
    dokumenName: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          jenisDokumen: '',
          noDokumen: '',
          tanggalMulai: '',
          tanggalBerakhir: '',
          status: 'Pengajuan',
          penerbit: '',
          keterangan: '',
          dokumenUrl: '',
          dokumenName: '',
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
    if (!form.jenisDokumen.trim() || !form.noDokumen.trim() || !form.tanggalMulai || !form.tanggalBerakhir) return;
    onSave({ ...form, jenisDokumen: form.jenisDokumen.trim(), noDokumen: form.noDokumen.trim() });
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
              <input
                name="jenisDokumen"
                value={form.jenisDokumen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: NIB, SIUP, TDP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Dokumen</label>
              <input
                name="noDokumen"
                value={form.noDokumen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: 123/ABC/2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
              <input
                name="penerbit"
                value={form.penerbit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: OSS, Kementerian, Pemda"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
              <input
                type="date"
                name="tanggalBerakhir"
                value={form.tanggalBerakhir}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Pengajuan">Pengajuan</option>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumen</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setForm((prev) => ({ ...prev, dokumenUrl: url, dokumenName: file.name }));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              {form.dokumenName && (
                <p className="mt-1 text-xs text-gray-600">Terunggah: {form.dokumenName}</p>
              )}
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

export default LegalitasPerusahaanModal;
