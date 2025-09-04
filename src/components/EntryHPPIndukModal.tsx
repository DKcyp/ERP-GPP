import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Calendar } from 'lucide-react';
import HPPDetailTabs from './HPPDetailTabs'; // Import the new component

interface EntryHPPIndukModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Mode untuk menyesuaikan perilaku modal (buat/edit/lihat)
  mode?: 'create' | 'edit' | 'view';
  // Data awal untuk prefilling ketika edit/lihat
  initialData?: {
    noKontrak?: string;
    durasiFrom?: string;
    durasiTo?: string;
    namaClient?: string;
    lokasiPekerjaan?: string;
    namaProject?: string;
    jenisPekerjaan?: string;
    estimasiNilaiKontrak?: string;
  };
  // Jika true, semua input menjadi read-only
  readOnly?: boolean;
}

const EntryHPPIndukModal: React.FC<EntryHPPIndukModalProps> = ({ isOpen, onClose, mode = 'create', initialData, readOnly }) => {
  const [noKontrak, setNoKontrak] = useState('');
  const [durasiFrom, setDurasiFrom] = useState('');
  const [durasiTo, setDurasiTo] = useState('');
  const [namaClient, setNamaClient] = useState('');
  const [lokasiPekerjaan, setLokasiPekerjaan] = useState('');
  const [namaProject, setNamaProject] = useState('');
  const [jenisPekerjaan, setJenisPekerjaan] = useState('');
  const [estimasiNilaiKontrak, setEstimasiNilaiKontrak] = useState('');

  const isReadOnly = readOnly || mode === 'view';

  useEffect(() => {
    if (isOpen && initialData) {
      setNoKontrak(initialData.noKontrak || '');
      setDurasiFrom(initialData.durasiFrom || '');
      setDurasiTo(initialData.durasiTo || '');
      setNamaClient(initialData.namaClient || '');
      setLokasiPekerjaan(initialData.lokasiPekerjaan || '');
      setNamaProject(initialData.namaProject || '');
      setJenisPekerjaan(initialData.jenisPekerjaan || '');
      setEstimasiNilaiKontrak(initialData.estimasiNilaiKontrak || '');
    }
    if (isOpen && !initialData && mode === 'create') {
      // reset form saat create
      setNoKontrak('');
      setDurasiFrom('');
      setDurasiTo('');
      setNamaClient('');
      setLokasiPekerjaan('');
      setNamaProject('');
      setJenisPekerjaan('');
      setEstimasiNilaiKontrak('');
    }
  }, [isOpen, initialData, mode]);

  const handleSave = () => {
    // Implementasi logika penyimpanan di sini
    console.log({
      noKontrak,
      durasiFrom,
      durasiTo,
      namaClient,
      lokasiPekerjaan,
      namaProject,
      jenisPekerjaan,
      estimasiNilaiKontrak,
    });
    onClose();
  };

  const kontrakOptions = ['KTR-001', 'KTR-002', 'KTR-003'];
  const clientOptions = ['Client A', 'Client B', 'Client C'];
  const jenisPekerjaanOptions = ['On Call', 'Project Based', 'Maintenance'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'view' ? 'Detail HPP Turunan' : 'Entry HPP Turunan'} size="6xl"> {/* Changed size to 6xl */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* No Kontrak */}
        <div className="space-y-2">
          <label htmlFor="noKontrak" className="block text-sm font-medium text-textSecondary">
            No Kontrak <span className="text-error">*</span>
          </label>
          <select
            id="noKontrak"
            value={noKontrak}
            onChange={(e) => setNoKontrak(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="">Pilih No Kontrak</option>
            {kontrakOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Durasi Kontrak */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-textSecondary">
            Durasi Kontrak
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="date"
                value={durasiFrom}
                onChange={(e) => setDurasiFrom(e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm pr-8 ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
            </div>
            <span className="text-sm text-textSecondary">s.d</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={durasiTo}
                onChange={(e) => setDurasiTo(e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm pr-8 ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Nama Client */}
        <div className="space-y-2">
          <label htmlFor="namaClient" className="block text-sm font-medium text-textSecondary">
            Nama Client <span className="text-error">*</span>
          </label>
          <select
            id="namaClient"
            value={namaClient}
            onChange={(e) => setNamaClient(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="">Pilih Nama Client</option>
            {clientOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Lokasi Pekerjaan */}
        <div className="space-y-2">
          <label htmlFor="lokasiPekerjaan" className="block text-sm font-medium text-textSecondary">
            Lokasi Pekerjaan <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="lokasiPekerjaan"
            value={lokasiPekerjaan}
            onChange={(e) => setLokasiPekerjaan(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
            placeholder="Jl. Perintis Kemerdekaan, Jakarta"
          />
        </div>

        {/* Nama Project */}
        <div className="space-y-2">
          <label htmlFor="namaProject" className="block text-sm font-medium text-textSecondary">
            Nama Project <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="namaProject"
            value={namaProject}
            onChange={(e) => setNamaProject(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
            placeholder="Masukkan nama project"
          />
        </div>

        {/* Jenis Pekerjaan */}
        <div className="space-y-2">
          <label htmlFor="jenisPekerjaan" className="block text-sm font-medium text-textSecondary">
            Jenis Pekerjaan
          </label>
          <select
            id="jenisPekerjaan"
            value={jenisPekerjaan}
            onChange={(e) => setJenisPekerjaan(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="">Pilih Jenis Pekerjaan</option>
            {jenisPekerjaanOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Estimasi Nilai Kontrak */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="estimasiNilaiKontrak" className="block text-sm font-medium text-textSecondary">
            Estimasi Nilai Kontrak
          </label>
          <input
            type="text"
            id="estimasiNilaiKontrak"
            value={estimasiNilaiKontrak}
            onChange={(e) => setEstimasiNilaiKontrak(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
            placeholder="Rp 0"
          />
        </div>
      </div>

      {/* New HPP Detail Tabs Component */}
      <HPPDetailTabs />

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-textSecondary/20 text-textSecondary rounded-md hover:bg-textSecondary/30 transition-colors text-sm font-medium"
        >
          Close
        </button>
        {!isReadOnly && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            Simpan
          </button>
        )}
      </div>
    </Modal>
  );
};

export default EntryHPPIndukModal;
