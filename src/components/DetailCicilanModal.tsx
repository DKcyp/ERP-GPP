import React, { useMemo, useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

export interface PembayaranCicilan {
  id: string;
  tanggal: string; // ISO
  jumlah: number;
  metode: string;
  catatan?: string;
}

export interface Borrower {
  id: string;
  nama: string;
  jabatan: string;
  totalPinjaman: number;
  pembayaran: PembayaranCicilan[];
}

interface DetailCicilanModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrower: Borrower | null;
  onSavePayment: (borrowerId: string, payment: Omit<PembayaranCicilan, 'id'>) => void;
  onDeletePayment?: (borrowerId: string, paymentId: string) => void;
}

const currency = (n: number) => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

const DetailCicilanModal: React.FC<DetailCicilanModalProps> = ({ isOpen, onClose, borrower, onSavePayment, onDeletePayment }) => {
  const [tanggal, setTanggal] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [jumlah, setJumlah] = useState<string>('');
  const [metode, setMetode] = useState<string>('Potong Gaji');
  const [catatan, setCatatan] = useState<string>('');

  const totalDibayar = useMemo(() => (borrower?.pembayaran || []).reduce((a, b) => a + (b.jumlah || 0), 0), [borrower]);
  const sisa = (borrower?.totalPinjaman || 0) - totalDibayar;

  if (!isOpen || !borrower) return null;

  const submit = () => {
    const j = parseFloat(jumlah || '0');
    if (!j || j <= 0) return;
    onSavePayment(borrower.id, {
      tanggal,
      jumlah: j,
      metode,
      catatan: catatan?.trim() || undefined,
    });
    // reset
    setJumlah('');
    setCatatan('');
  };

  const handleDelete = (pid: string) => {
    if (onDeletePayment) onDeletePayment(borrower.id, pid);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Cicilan - {borrower.nama}</h2>
            <p className="text-sm text-gray-600">Jabatan: {borrower.jabatan}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500">Total Pinjaman</div>
              <div className="text-lg font-semibold">{currency(borrower.totalPinjaman)}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500">Total Dibayar</div>
              <div className="text-lg font-semibold text-green-700">{currency(totalDibayar)}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500">Sisa Pinjaman</div>
              <div className="text-lg font-semibold text-amber-700">{currency(sisa)}</div>
            </div>
          </div>

          {/* Form Input Cicilan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Input Cicilan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Cicilan</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="0" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50" value={metode} onChange={(e) => setMetode(e.target.value)}>
                  <option>Potong Gaji</option>
                  <option>Transfer</option>
                  <option>Kas</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={submit} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Cicilan
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </div>
          </div>

          {/* Tabel Pembayaran */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Riwayat Pembayaran</h3>
              <div className="text-sm text-gray-600">Sisa: <span className="font-semibold text-amber-700">{currency(sisa)}</span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(borrower.pembayaran || []).map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{new Date(p.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{p.metode}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{currency(p.jumlah)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{p.catatan || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        {onDeletePayment && (
                          <button onClick={() => handleDelete(p.id)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs">
                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default DetailCicilanModal;
