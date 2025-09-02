import React from 'react';
import Modal from './Modal';
import { PTJDetailItem } from '../types';

interface PTJDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  details: PTJDetailItem[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
};

const PTJDetailModal: React.FC<PTJDetailModalProps> = ({ isOpen, onClose, title = 'Detail PTJ', details }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-surface rounded-xl shadow-sm border border-border">
            <thead>
              <tr className="bg-background border-b border-border text-textSecondary text-xs font-semibold uppercase tracking-wider">
                <th className="px-3 py-2 text-left">Deskripsi</th>
                <th className="px-3 py-2 text-left">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {details && details.length > 0 ? (
                details.map((d, idx) => (
                  <tr key={idx} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 text-xs text-text">{d.deskripsi}</td>
                    <td className="px-3 py-2 text-xs text-text">{formatCurrency(d.nominal)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-2 text-xs text-text" colSpan={2}>Tidak ada detail PTJ.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 border border-border text-textSecondary text-sm rounded-xl shadow-md hover:bg-background transition-colors duration-300">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PTJDetailModal;
