import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { EntryPOJasaItem } from '../types';

interface EditPOJasaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (poId: number, updatedItems: EntryPOJasaItem[]) => void;
  poId: number | null;
  initialItems: EntryPOJasaItem[];
}

const EditPOJasaModal: React.FC<EditPOJasaModalProps> = ({ isOpen, onClose, onSubmit, poId, initialItems }) => {
  const [items, setItems] = useState<EntryPOJasaItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleItemChange = (id: string, field: keyof EntryPOJasaItem, value: any) => {
    setItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate 'jumlah' if 'qty', 'hargaSatuan', or 'disc' changes
          if (field === 'qty' || field === 'hargaSatuan' || field === 'disc') {
            const qty = updatedItem.qty || 0;
            const hargaSatuan = updatedItem.hargaSatuan || 0;
            const disc = updatedItem.disc || 0;
            updatedItem.jumlah = (qty * hargaSatuan) * (1 - disc / 100); // Assuming disc is percentage
          }
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (poId !== null) {
      onSubmit(poId, items);
    }
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit PO Jasa" size="5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Jasa Items Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nama Jasa</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Kode Jasa</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Qty</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Satuan</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Harga Satuan</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Disc (Rp)</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Jumlah</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Keterangan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.namaJasa}
                      onChange={(e) => handleItemChange(item.id, 'namaJasa', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.kodeJasa}
                      onChange={(e) => handleItemChange(item.id, 'kodeJasa', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 0)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.satuan}
                      onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.hargaSatuan}
                      onChange={(e) => handleItemChange(item.id, 'hargaSatuan', parseFloat(e.target.value) || 0)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.disc}
                      onChange={(e) => handleItemChange(item.id, 'disc', parseFloat(e.target.value) || 0)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.jumlah)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.keterangan}
                      onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPOJasaModal;
