import React from 'react';
import Modal from './Modal';
import { POApprovalHistory } from '../types';

interface HistoryApprovePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  poId: number | null;
}

const mockApprovalHistory: POApprovalHistory = {
  managerPPIC: 'Approve',
  gudangManajer: 'Approve',
  direkturOPS: 'Approve',
  direkturUtama: 'Approve',
};

const HistoryApprovePOModal: React.FC<HistoryApprovePOModalProps> = ({ isOpen, onClose, poId }) => {
  if (!isOpen || poId === null) return null;

  // In a real application, you would fetch history based on poId
  // For now, we use mock data.
  const history = mockApprovalHistory;

  const handleApprove = (role: keyof POApprovalHistory) => {
    console.log(`Approving for ${role} for PO ID: ${poId}`);
    // Implement actual approval logic here (e.g., API call)
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="History Approve" size="3xl">
      <div className="p-4">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Manager PPIC
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Gudang Manajer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Direktur OPS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Direktur Utama
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleApprove('managerPPIC')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    {history.managerPPIC}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleApprove('gudangManajer')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    {history.gudangManajer}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleApprove('direkturOPS')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    {history.direkturOPS}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleApprove('direkturUtama')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    {history.direkturUtama}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryApprovePOModal;
