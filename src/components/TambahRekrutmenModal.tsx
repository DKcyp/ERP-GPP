import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

export interface TambahRekrutmenForm {
  namaPelamar: string;
  email: string;
  posisi: string;
  file?: File | null;
}

interface TambahRekrutmenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    namaPelamar: string;
    email: string;
    posisi: string;
    fileName?: string;
    fileUrl?: string;
  }) => void;
}

const TambahRekrutmenModal: React.FC<TambahRekrutmenModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<TambahRekrutmenForm>({
    namaPelamar: "",
    email: "",
    posisi: "",
    file: null,
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({ namaPelamar: "", email: "", posisi: "", file: null });
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!form.namaPelamar || !form.email || !form.posisi) return;

    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (form.file) {
      fileUrl = URL.createObjectURL(form.file);
      fileName = form.file.name;
    }

    onSave({
      namaPelamar: form.namaPelamar,
      email: form.email,
      posisi: form.posisi,
      fileName,
      fileUrl,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Tambah Rekrutmen</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Pelamar</label>
            <input
              type="text"
              value={form.namaPelamar}
              onChange={(e) => setForm((p) => ({ ...p, namaPelamar: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              placeholder="Masukkan nama pelamar"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Posisi</label>
            <input
              type="text"
              value={form.posisi}
              onChange={(e) => setForm((p) => ({ ...p, posisi: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              placeholder="Contoh: Staff HR, Teknisi, ..."
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Upload File (CV/Dokumen)</label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm hover:border-cyan-400">
              <span className="text-gray-600">
                {form.file ? form.file.name : "Pilih file (PDF/DOC/IMG)"}
              </span>
              <span className="inline-flex items-center gap-2 rounded bg-cyan-600 px-3 py-1 text-white">
                <Upload className="h-4 w-4" /> Pilih
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahRekrutmenModal;
