import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

export interface TambahTalentPoolData {
  namaPelamar: string;
  noTelp: string;
  email: string;
  kualifikasi: string;
  fileName?: string;
  fileUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TambahTalentPoolData) => void;
}

const TambahTalentPoolModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [namaPelamar, setNamaPelamar] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [email, setEmail] = useState("");
  const [kualifikasi, setKualifikasi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNamaPelamar("");
      setNoTelp("");
      setEmail("");
      setKualifikasi("");
      setFile(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelamar || !email) return;
    const payload: TambahTalentPoolData = {
      namaPelamar,
      noTelp,
      email,
      kualifikasi,
    };
    if (file) {
      payload.fileName = file.name;
      payload.fileUrl = URL.createObjectURL(file);
    }
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Tambah Talent Pool</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Pelamar</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              value={namaPelamar}
              onChange={(e) => setNamaPelamar(e.target.value)}
              required
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">No. Telp</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              value={noTelp}
              onChange={(e) => setNoTelp(e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kualifikasi</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-cyan-500"
              rows={3}
              value={kualifikasi}
              onChange={(e) => setKualifikasi(e.target.value)}
              placeholder="Ringkasan kualifikasi"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Upload File (CV/Dokumen)</label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm hover:border-cyan-400">
              <span className="text-gray-600">{file ? file.name : "Pilih file (PDF/DOC/IMG)"}</span>
              <span className="inline-flex items-center gap-2 rounded bg-cyan-600 px-3 py-1 text-white">
                <Upload className="h-4 w-4" /> Pilih
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
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

export default TambahTalentPoolModal;
