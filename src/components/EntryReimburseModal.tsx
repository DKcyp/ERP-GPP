import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Plus, Trash2, UploadCloud } from 'lucide-react';

// Set app element for react-modal
Modal.setAppElement('#root'); // Assuming your root element has id 'root'

interface EntryReimburseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface ReimburseItem {
  id: number;
  keperluan: string;
  nominal: string;
  namaAkunCOA: string;
}

const EntryReimburseModal: React.FC<EntryReimburseModalProps> = ({ isOpen, onRequestClose }) => {
  const [reimburseNo, setReimburseNo] = useState('');
  const [soNo, setSoNo] = useState('');
  const [soTurunan, setSoTurunan] = useState('');
  const [pemohon, setPemohon] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [lampiran, setLampiran] = useState<File | null>(null);
  const [reimburseItems, setReimburseItems] = useState<ReimburseItem[]>([
    { id: 1, keperluan: '', nominal: '', namaAkunCOA: '' }
  ]);

  const handleAddItem = () => {
    setReimburseItems([...reimburseItems, { id: Date.now(), keperluan: '', nominal: '', namaAkunCOA: '' }]);
  };

  const handleRemoveItem = (id: number) => {
    setReimburseItems(reimburseItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof ReimburseItem, value: string) => {
    setReimburseItems(reimburseItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLampiran(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setLampiran(event.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      reimburseNo,
      soNo,
      soTurunan,
      pemohon,
      departemen,
      lampiran,
      reimburseItems,
    });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Entry Reimburse</h2>
          <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Reimburse</label>
              <select
                value={reimburseNo}
                onChange={(e) => setReimburseNo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">R006</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. SO</label>
              <select
                value={soNo}
                onChange={(e) => setSoNo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">SO001</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. SO Turunan</label>
              <select
                value={soTurunan}
                onChange={(e) => setSoTurunan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">SO001.12 - Proyek Alpha</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
              <select
                value={pemohon}
                onChange={(e) => setPemohon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Faizal</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Departemen</label>
              <select
                value={departemen}
                onChange={(e) => setDepartemen(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Marketing</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran</label>
              <div
                className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-reimburse')?.click()}
              >
                <input
                  id="file-upload-reimburse"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {lampiran ? (
                  <p className="text-sm text-gray-700">{lampiran.name}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="h-6 w-6 text-gray-400" />
                    <p className="text-sm text-gray-500">Drag & Drop your files or <span className="font-semibold text-blue-600">Browse</span></p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">Powered by PONA</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Reimburse</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Akun / COA</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reimburseItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.keperluan}
                          onChange={(e) => handleItemChange(item.id, 'keperluan', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.nominal}
                          onChange={(e) => handleItemChange(item.id, 'nominal', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <select
                          value={item.namaAkunCOA}
                          onChange={(e) => handleItemChange(item.id, 'namaAkunCOA', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">8011-Kas Kecil</option>
                          {/* Add more options as needed */}
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
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
              type="button"
              onClick={handleAddItem}
              className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EntryReimburseModal;
