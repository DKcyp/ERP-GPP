import React from 'react';
import Modal from './Modal';
import { HistoryIzinEntry } from '../types';

interface HistoryIzinModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: HistoryIzinEntry[];
}

const HistoryIzinModal: React.FC<HistoryIzinModalProps> = ({ isOpen, onClose, historyData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="History Izin" size="3xl">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Tanggal Perpanjang
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Tanggal Exp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Dokumen
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Catatan
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {historyData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary text-center">
                  Tidak ada riwayat izin.
                </td>
              </tr>
            ) : (
              historyData.map((entry, index) => (
                <tr key={index} className="hover:bg-background transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{entry.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{entry.tanggalPerpanjang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{entry.tanggalExp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                    <a
                      href={entry.dokumenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                    >
                      Lihat Dokumen
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{entry.catatan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-textSecondary bg-background hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default HistoryIzinModal;
