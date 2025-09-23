import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface FollowUp {
  tanggal: string;
  status: string;
}

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUps: FollowUp[];
  onSave: (newFollowUps: FollowUp[]) => void;
  invoiceNumber: string;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, followUps: initialFollowUps, onSave, invoiceNumber }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [newFollowUp, setNewFollowUp] = useState({ tanggal: new Date().toISOString().split('T')[0], status: '' });

  if (!isOpen) return null;

  const handleAddFollowUp = () => {
    if (newFollowUp.status.trim() === '') {
      alert('Status follow up tidak boleh kosong.');
      return;
    }
    const updatedFollowUps = [...followUps, newFollowUp];
    setFollowUps(updatedFollowUps);
    setNewFollowUp({ tanggal: new Date().toISOString().split('T')[0], status: '' });
  };

  const handleRemoveFollowUp = (index: number) => {
    const updatedFollowUps = followUps.filter((_, i) => i !== index);
    setFollowUps(updatedFollowUps);
  };

  const handleSave = () => {
    onSave(followUps);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Follow Up History - {invoiceNumber}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          {/* Add new follow-up form */}
          <div className="flex items-end gap-3 mb-4 p-3 border rounded-md bg-gray-50">
            <div className="flex-grow">
              <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal</label>
              <input 
                type="date" 
                value={newFollowUp.tanggal}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex-grow">
              <label className="block text-xs font-medium text-gray-600 mb-1">Status Follow Up</label>
              <input 
                type="text" 
                placeholder="Cth: Telepon customer..."
                value={newFollowUp.status}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button onClick={handleAddFollowUp} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 text-sm">
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Follow-up history table */}
          <h3 className="text-md font-semibold text-gray-700 mb-2">History</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-2">Tanggal</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {followUps.length > 0 ? (
                  followUps.map((fu, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(fu.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-2">{fu.status}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleRemoveFollowUp(index)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">Belum ada history follow up.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Batal
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Simpan History
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal; 
