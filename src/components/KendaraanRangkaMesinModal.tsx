import React, { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { noRangka: string; noMesin: string }) => void;
  initialData?: { merek?: string; platNomor?: string; noRangka?: string; noMesin?: string } | null;
}

const KendaraanRangkaMesinModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [noRangka, setNoRangka] = useState(initialData?.noRangka ?? '');
  const [noMesin, setNoMesin] = useState(initialData?.noMesin ?? '');

  useEffect(() => {
    if (isOpen) {
      setNoRangka(initialData?.noRangka ?? '');
      setNoMesin(initialData?.noMesin ?? '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ noRangka: noRangka.trim(), noMesin: noMesin.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lengkapi No. Rangka & No. Mesin</h3>
        </div>
        <form onSubmit={submit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
              <input
                type="text"
                value={initialData?.merek ?? ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
              <input
                type="text"
                value={initialData?.platNomor ?? ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Rangka</label>
            <input
              type="text"
              value={noRangka}
              onChange={(e) => setNoRangka(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan No. Rangka"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Mesin</label>
            <input
              type="text"
              value={noMesin}
              onChange={(e) => setNoMesin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan No. Mesin"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KendaraanRangkaMesinModal;
