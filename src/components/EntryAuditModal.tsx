import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDays, FileText, User, Tag } from 'lucide-react';

interface EntryAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (audit: Omit<AuditItem, 'id'>) => void;
  initialData?: Omit<AuditItem, 'id'>; // Optional for editing
}

interface AuditItem {
  id: string;
  namaPegawai: string;
  jenisAudit: string;
  tanggalAudit: string;
  documentUrl: string;
}

const EntryAuditModal: React.FC<EntryAuditModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [namaPegawai, setNamaPegawai] = useState('');
  const [jenisAudit, setJenisAudit] = useState('');
  const [tanggalAudit, setTanggalAudit] = useState<Date | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setNamaPegawai(initialData.namaPegawai);
      setJenisAudit(initialData.jenisAudit);
      setTanggalAudit(initialData.tanggalAudit ? new Date(initialData.tanggalAudit) : null);
      setDocumentUrl(initialData.documentUrl);
    } else if (isOpen && !initialData) {
      // Reset form when opening for new entry
      setNamaPegawai('');
      setJenisAudit('');
      setTanggalAudit(null);
      setDocumentUrl('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPegawai || !jenisAudit || !tanggalAudit || !documentUrl) {
      alert('Harap lengkapi semua bidang.');
      return;
    }
    onSave({
      namaPegawai,
      jenisAudit,
      tanggalAudit: tanggalAudit.toISOString().split('T')[0], // Format to YYYY-MM-DD
      documentUrl,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Data Audit' : 'Tambah Data Audit'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="namaPegawai" className="block text-sm font-medium text-textSecondary mb-2">
            Nama Pegawai
          </label>
          <div className="relative">
            <input
              type="text"
              id="namaPegawai"
              className="block w-full border border-border rounded-lg pl-10 pr-4 py-2 bg-surface text-text focus:ring-primary focus:border-primary text-sm"
              placeholder="Masukkan nama pegawai"
              value={namaPegawai}
              onChange={(e) => setNamaPegawai(e.target.value)}
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          </div>
        </div>

        <div>
          <label htmlFor="jenisAudit" className="block text-sm font-medium text-textSecondary mb-2">
            Jenis Audit
          </label>
          <div className="relative">
            <select
              id="jenisAudit"
              className="block w-full border border-border rounded-lg pl-10 pr-4 py-2 bg-surface text-text focus:ring-primary focus:border-primary text-sm appearance-none"
              value={jenisAudit}
              onChange={(e) => setJenisAudit(e.target.value)}
              required
            >
              <option value="">Pilih jenis audit...</option>
              <option value="Internal QMS">Internal QMS</option>
              <option value="Eksternal ISO 45001">Eksternal ISO 45001</option>
              <option value="Internal EMS">Internal EMS</option>
              <option value="Supplier Audit">Supplier Audit</option>
              <option value="Audit Keamanan Data">Audit Keamanan Data</option>
            </select>
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          </div>
        </div>

        <div>
          <label htmlFor="tanggalAudit" className="block text-sm font-medium text-textSecondary mb-2">
            Tanggal Audit
          </label>
          <div className="relative">
            <DatePicker
              selected={tanggalAudit}
              onChange={(date: Date | null) => setTanggalAudit(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pilih tanggal"
              className="block w-full border border-border rounded-lg pl-10 pr-4 py-2 bg-surface text-text focus:ring-primary focus:border-primary text-sm"
              required
            />
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          </div>
        </div>

        <div>
          <label htmlFor="documentUrl" className="block text-sm font-medium text-textSecondary mb-2">
            URL Dokumen
          </label>
          <div className="relative">
            <input
              type="url"
              id="documentUrl"
              className="block w-full border border-border rounded-lg pl-10 pr-4 py-2 bg-surface text-text focus:ring-primary focus:border-primary text-sm"
              placeholder="Masukkan URL dokumen"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              required
            />
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md text-sm font-medium text-textSecondary hover:bg-surface hover:text-text transition-colors duration-200"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            {initialData ? 'Simpan Perubahan' : 'Tambah Audit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EntryAuditModal;
