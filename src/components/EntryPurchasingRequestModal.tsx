import React, { useState } from 'react';
import Modal from './Modal';
import { CalendarDays } from 'lucide-react';
import { EntryPurchasingRequestFormData } from '../types';

interface EntryPurchasingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntryPurchasingRequestFormData) => void;
}

const EntryPurchasingRequestModal: React.FC<EntryPurchasingRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EntryPurchasingRequestFormData>({
    tanggalPR: '',
    noPR: '',
    noSO: '',
    departemen: '',
    keterangan: '',
    statusPR: '',
    statusPO: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      tanggalPR: '',
      noPR: '',
      noSO: '',
      departemen: '',
      keterangan: '',
      statusPR: '',
      statusPO: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entry Purchasing Request" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tanggal PR */}
          <div>
            <label htmlFor="tanggalPR" className="block text-sm font-medium text-textSecondary mb-1">Tanggal PR</label>
            <div className="relative">
              <input
                type="date"
                id="tanggalPR"
                name="tanggalPR"
                value={formData.tanggalPR}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm pr-8"
              />
              <CalendarDays className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
            </div>
          </div>

          {/* No PR */}
          <div>
            <label htmlFor="noPR" className="block text-sm font-medium text-textSecondary mb-1">No PR</label>
            <input
              type="text"
              id="noPR"
              name="noPR"
              value={formData.noPR}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="PR00X"
            />
          </div>

          {/* No SO */}
          <div>
            <label htmlFor="noSO" className="block text-sm font-medium text-textSecondary mb-1">No SO</label>
            <input
              type="text"
              id="noSO"
              name="noSO"
              value={formData.noSO}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="SO00X.YY"
            />
          </div>

          {/* Departemen */}
          <div>
            <label htmlFor="departemen" className="block text-sm font-medium text-textSecondary mb-1">Departemen</label>
            <input
              type="text"
              id="departemen"
              name="departemen"
              value={formData.departemen}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="HRD, Finance, Operasional"
            />
          </div>

          {/* Status PR */}
          <div>
            <label htmlFor="statusPR" className="block text-sm font-medium text-textSecondary mb-1">Status PR</label>
            <select
              id="statusPR"
              name="statusPR"
              value={formData.statusPR}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
            >
              <option value="">Pilih Status PR</option>
              <option value="Approve">Approve</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Status PO */}
          <div>
            <label htmlFor="statusPO" className="block text-sm font-medium text-textSecondary mb-1">Status PO</label>
            <select
              id="statusPO"
              name="statusPO"
              value={formData.statusPO}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
            >
              <option value="">Pilih Status PO</option>
              <option value="PO">PO</option>
              <option value="-">-</option>
            </select>
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <label htmlFor="keterangan" className="block text-sm font-medium text-textSecondary mb-1">Keterangan</label>
          <textarea
            id="keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
            placeholder="Masukkan keterangan..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-textSecondary/20 text-textSecondary rounded-md hover:bg-textSecondary/30 transition-colors text-sm font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            Simpan PR
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EntryPurchasingRequestModal;
