import React, { useState, useEffect } from 'react';

interface KendaraanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { merek: string; platNomor: string; tahunPembelian: number; warna: string }) => void;
  initialData?: { merek: string; platNomor: string; tahunPembelian: number; warna: string } | null;
  title?: string;
  submitLabel?: string;
}

const KendaraanModal: React.FC<KendaraanModalProps> = ({ isOpen, onClose, onSave, initialData = null, title = 'Tambah Kendaraan', submitLabel = 'Simpan' }) => {
  const [merek, setMerek] = useState(initialData?.merek ?? '');
  const [platNomor, setPlatNomor] = useState(initialData?.platNomor ?? '');
  const [tahunPembelian, setTahunPembelian] = useState(initialData?.tahunPembelian ?? 0);
  const [warna, setWarna] = useState(initialData?.warna ?? '');

  useEffect(() => {
    if (isOpen) {
      setMerek(initialData?.merek ?? '');
      setPlatNomor(initialData?.platNomor ?? '');
      setTahunPembelian(initialData?.tahunPembelian ?? 0);
      setWarna(initialData?.warna ?? '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merek.trim() || !platNomor.trim() || !tahunPembelian || !warna.trim()) return;
    onSave({ merek: merek.trim(), platNomor: platNomor.trim(), tahunPembelian, warna: warna.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
            <input
              type="text"
              value={merek}
              onChange={(e) => setMerek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Expander"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
            <input
              type="text"
              value={platNomor}
              onChange={(e) => setPlatNomor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: B 1875 ROB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pembelian</label>
            <input
              type="number"
              value={tahunPembelian}
              onChange={(e) => setTahunPembelian(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: 2020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
            <input
              type="text"
              value={warna}
              onChange={(e) => setWarna(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Hitam"
            />
          </div>
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KendaraanModal;
