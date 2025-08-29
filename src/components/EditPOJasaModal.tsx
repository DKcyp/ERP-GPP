import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, ThumbsUp } from 'lucide-react';
import { EntryPOJasaItem } from '../types';

interface EditPOJasaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (poId: number, updatedItems: EntryPOJasaItem[], newStatus?: string) => void;
  poId: number;
  initialItems: EntryPOJasaItem[];
  initialStatus: 'Paid' | 'Unpaid'; // Added initialStatus
  isApprovalMode?: boolean; // New prop
}

const EditPOJasaModal: React.FC<EditPOJasaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  poId,
  initialItems,
  initialStatus,
  isApprovalMode = false,
}) => {
  const [items, setItems] = useState<EntryPOJasaItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setItems(initialItems);
    }
  }, [isOpen, initialItems]);

  const handleItemChange = (index: number, field: keyof EntryPOJasaItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    // Recalculate jumlah if hargaSatuan or disc or qty changes
    if (field === 'hargaSatuan' || field === 'disc' || field === 'qty') {
      const qty = newItems[index].qty || 0;
      const hargaSatuan = newItems[index].hargaSatuan || 0;
      const disc = newItems[index].disc || 0;
      newItems[index].jumlah = qty * hargaSatuan * (1 - disc / 100);
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), namaJasa: '', kodeJasa: '', qty: 1, satuan: 'Pax', hargaSatuan: 0, disc: 0, jumlah: 0, keterangan: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    onSubmit(poId, items); // Regular edit, no status change
    setIsLoading(false);
    onClose();
  };

  const handleApprove = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    onSubmit(poId, items, 'Paid'); // Submit with 'Paid' status for approval
    setIsLoading(false);
    onClose();
    alert('PO Jasa berhasil di-approve!');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-2xl font-bold text-text">
            {isApprovalMode ? `Approve PO Jasa #${poId}` : `Edit PO Jasa #${poId}`}
          </h3>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-text transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-140px)]">
          {isApprovalMode && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2">
              <ThumbsUp size={20} />
              <span>Mode Persetujuan: Tinjau detail PO Jasa sebelum menyetujui. Status saat ini: <span className="font-semibold">{initialStatus}</span></span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-textSecondary mb-2">
              Detail Item Jasa
            </label>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="bg-background p-4 rounded-lg border border-border relative">
                  {!isApprovalMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Hapus Item"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`namaJasa-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Nama Jasa</label>
                      <input
                        type="text"
                        id={`namaJasa-${index}`}
                        value={item.namaJasa}
                        onChange={(e) => handleItemChange(index, 'namaJasa', e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm"
                        readOnly={isApprovalMode}
                      />
                    </div>
                    <div>
                      <label htmlFor={`kodeJasa-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Kode Jasa</label>
                      <input
                        type="text"
                        id={`kodeJasa-${index}`}
                        value={item.kodeJasa}
                        onChange={(e) => handleItemChange(index, 'kodeJasa', e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm"
                        readOnly={isApprovalMode}
                      />
                    </div>
                    <div>
                      <label htmlFor={`qty-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Qty</label>
                      <input
                        type="number"
                        id={`qty-${index}`}
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm"
                        readOnly={isApprovalMode}
                      />
                    </div>
                    <div>
                      <label htmlFor={`satuan-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Satuan</label>
                      <input
                        type="text"
                        id={`satuan-${index}`}
                        value={item.satuan}
                        onChange={(e) => handleItemChange(index, 'satuan', e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm"
                        readOnly={isApprovalMode}
                      />
                    </div>
                    <div>
                      <label htmlFor={`hargaSatuan-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Harga Satuan</label>
                      <input
                        type="number"
                        id={`hargaSatuan-${index}`}
                        value={item.hargaSatuan}
                        onChange={(e) => handleItemChange(index, 'hargaSatuan', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm"
                        readOnly={isApprovalMode}
                      />
                    </div>
                    <div>
                      <label htmlFor={`disc-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Disc (%)</label>
                      <input
                        type="number"
                        id={`disc-${index}`}
                        value={item.disc}
                        onChange={(e) => handleItemChange(index, 'disc', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm"
                        readOnly={isApprovalMode}
                      />
                    </div>
                    <div>
                      <label htmlFor={`jumlah-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Jumlah</label>
                      <input
                        type="number"
                        id={`jumlah-${index}`}
                        value={item.jumlah}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor={`keterangan-${index}`} className="block text-xs font-medium text-textSecondary mb-1">Keterangan</label>
                      <textarea
                        id={`keterangan-${index}`}
                        value={item.keterangan}
                        onChange={(e) => handleItemChange(index, 'keterangan', e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm resize-y"
                        rows={2}
                        readOnly={isApprovalMode}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!isApprovalMode && (
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Tambah Item Jasa
              </button>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              Batal
            </button>
            {isApprovalMode ? (
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 bg-success text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Approving...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4 mr-2" /> Approve
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPOJasaModal;
