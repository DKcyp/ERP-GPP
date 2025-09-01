import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { VoucherEntry, ReimburseDetailItem } from '../types';

interface PertanggungJawabanEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherData: VoucherEntry | null; // Initial data for the form
}

const PertanggungJawabanEntryModal: React.FC<PertanggungJawabanEntryModalProps> = ({ isOpen, onClose, voucherData }) => {
  const [noReimburse, setNoReimburse] = useState('');
  const [noSO, setNoSO] = useState('');
  const [noSOTurunan, setNoSOTurunan] = useState('');
  const [namaPemohon, setNamaPemohon] = useState('');
  const [namaDepartemen, setNamaDepartemen] = useState('');
  const [lampiranFiles, setLampiranFiles] = useState<File[]>([]);
  const [detailItems, setDetailItems] = useState<ReimburseDetailItem[]>([]);

  useEffect(() => {
    if (voucherData) {
      setNoReimburse(voucherData.noVoucher);
      setNoSO(voucherData.noSO);
      setNoSOTurunan(voucherData.noSOTurunan);
      setNamaPemohon(voucherData.namaPemohon);
      // Placeholder for namaDepartemen, as it's not directly in VoucherEntry
      setNamaDepartemen('IT'); // Default or derive from project name
      setLampiranFiles([]); // No files initially from VoucherEntry
      setDetailItems([
        {
          id: '1', // Unique ID
          keperluan: voucherData.keterangan,
          nominal: parseFloat(voucherData.nominal.replace('Rp ', '').replace(/\./g, '')),
          namaAkunCoa: '8011-Kas Kecil', // Default
        },
      ]);
    } else {
      // Reset form when modal closes or no data
      setNoReimburse('');
      setNoSO('');
      setNoSOTurunan('');
      setNamaPemohon('');
      setNamaDepartemen('');
      setLampiranFiles([]);
      setDetailItems([]);
    }
  }, [voucherData]);

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setLampiranFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setLampiranFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setLampiranFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAddDetailItem = () => {
    setDetailItems((prevItems) => [
      ...prevItems,
      { id: String(prevItems.length + 1), keperluan: '', nominal: 0, namaAkunCoa: '' },
    ]);
  };

  const handleRemoveDetailItem = (id: string) => {
    setDetailItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleDetailItemChange = (id: string, field: keyof ReimburseDetailItem, value: any) => {
    setDetailItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = () => {
    console.log({
      noReimburse,
      noSO,
      noSOTurunan,
      namaPemohon,
      namaDepartemen,
      lampiranFiles,
      detailItems,
    });
    // Here you would typically send this data to an API
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entry Pertanggung Jawaban Voucher" size="4xl">
      <div className="space-y-6">
        {/* Top Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* No. Reimburse */}
          <div>
            <label htmlFor="noReimburse" className="block text-sm font-medium text-textSecondary mb-2">No. Reimburse</label>
            <select
              id="noReimburse"
              className="w-full px-4 py-2 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
              value={noReimburse}
              onChange={(e) => setNoReimburse(e.target.value)}
            >
              <option value="">--Pilih No. Reimburse--</option>
              <option value="R006">R006</option>
              <option value="R007">R007</option>
            </select>
          </div>
          {/* No. SO */}
          <div>
            <label htmlFor="noSO" className="block text-sm font-medium text-textSecondary mb-2">No. SO</label>
            <select
              id="noSO"
              className="w-full px-4 py-2 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
              value={noSO}
              onChange={(e) => setNoSO(e.target.value)}
            >
              <option value="">--Pilih No. SO--</option>
              <option value="SO001">SO001</option>
              <option value="SO002">SO002</option>
            </select>
          </div>
          {/* No. SO Turunan */}
          <div>
            <label htmlFor="noSOTurunan" className="block text-sm font-medium text-textSecondary mb-2">No. SO Turunan</label>
            <select
              id="noSOTurunan"
              className="w-full px-4 py-2 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
              value={noSOTurunan}
              onChange={(e) => setNoSOTurunan(e.target.value)}
            >
              <option value="">--Pilih No. SO Turunan--</option>
              <option value="SO001.12 - Proyek Alpha">SO001.12 - Proyek Alpha</option>
              <option value="SO002.05 - Proyek Beta">SO002.05 - Proyek Beta</option>
            </select>
          </div>
          {/* Nama Pemohon */}
          <div>
            <label htmlFor="namaPemohon" className="block text-sm font-medium text-textSecondary mb-2">Nama Pemohon</label>
            <select
              id="namaPemohon"
              className="w-full px-4 py-2 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
              value={namaPemohon}
              onChange={(e) => setNamaPemohon(e.target.value)}
            >
              <option value="">--Pilih Pemohon--</option>
              <option value="Faizal">Faizal</option>
              <option value="Abdul Karim">Abdul Karim</option>
            </select>
          </div>
          {/* Nama Departemen */}
          <div>
            <label htmlFor="namaDepartemen" className="block text-sm font-medium text-textSecondary mb-2">Nama Departemen</label>
            <select
              id="namaDepartemen"
              className="w-full px-4 py-2 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
              value={namaDepartemen}
              onChange={(e) => setNamaDepartemen(e.target.value)}
            >
              <option value="">--Pilih Departemen--</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
            </select>
          </div>
          {/* Lampiran */}
          <div className="md:col-span-1">
            <label htmlFor="lampiran" className="block text-sm font-medium text-textSecondary mb-2">Lampiran</label>
            <div
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-background hover:bg-surface/50 transition-colors duration-200"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <UploadCloud className="h-8 w-8 text-textSecondary mb-2" />
              <p className="text-sm text-textSecondary">Drag & Drop your files or <span className="text-primary font-medium">Browse</span></p>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
            </div>
            <div className="mt-2 space-y-1">
              {lampiranFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-textSecondary bg-background p-2 rounded-md border border-border">
                  <span>{file.name}</span>
                  <button onClick={() => handleRemoveFile(index)} className="text-error hover:text-error/80">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Reimburse Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-text mb-4">Detail Reimburse</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-surface rounded-xl shadow-sm border border-border">
              <thead>
                <tr className="bg-background border-b border-border text-textSecondary text-sm font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">KEPERLUAN</th>
                  <th className="px-4 py-3 text-left">NOMINAL</th>
                  <th className="px-4 py-3 text-left">NAMA AKUN / COA</th>
                  <th className="px-4 py-3 text-left">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {detailItems.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-background transition-colors duration-150">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text text-sm focus:ring-primary focus:border-primary"
                        value={item.keperluan}
                        onChange={(e) => handleDetailItemChange(item.id, 'keperluan', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text text-sm focus:ring-primary focus:border-primary"
                        value={item.nominal}
                        onChange={(e) => handleDetailItemChange(item.id, 'nominal', parseFloat(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text text-sm focus:ring-primary focus:border-primary"
                        value={item.namaAkunCoa}
                        onChange={(e) => handleDetailItemChange(item.id, 'namaAkunCoa', e.target.value)}
                      >
                        <option value="">--Pilih Akun--</option>
                        <option value="8011-Kas Kecil">8011-Kas Kecil</option>
                        <option value="8012-Biaya Perjalanan">8012-Biaya Perjalanan</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemoveDetailItem(item.id)}
                        className="text-error hover:text-error/80 transition-colors duration-200 p-2 rounded-full"
                        aria-label="Remove detail item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleAddDetailItem}
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-xl shadow-md hover:bg-primary/80 transition-colors duration-300"
          >
            <Plus className="h-4 w-4 mr-2" /> Tambah
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-border mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-border text-textSecondary rounded-xl shadow-md hover:bg-background transition-colors duration-300"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white font-medium rounded-xl shadow-md hover:bg-primary/80 transition-colors duration-300"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PertanggungJawabanEntryModal;
