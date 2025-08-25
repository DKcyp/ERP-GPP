import React from 'react';
import { X, CalendarDays, Trash2 } from 'lucide-react';

interface EntryPenerimaanBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EntryPenerimaanBarangModal: React.FC<EntryPenerimaanBarangModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalBarangItems = [
    { kode: 'BRG001', nama: 'Besi Beton', kategori: 'Material Konstruksi', satuan: 'Batang', diminta: 10, diterima: 10, hargaSatuan: 'Rp 50.000', hargaTotal: 'Rp 500.000', kondisi: 'Baik', tglExp: '2026-12-31' },
    { kode: 'BRG002', nama: 'Semen Portland', kategori: 'Material Konstruksi', satuan: 'Sak', diminta: 5, diterima: 5, hargaSatuan: 'Rp 70.000', hargaTotal: 'Rp 350.000', kondisi: 'Baik', tglExp: '2025-10-15' },
    { kode: 'BRG003', nama: 'Pipa PVC', kategori: 'Material Plumbing', satuan: 'Meter', diminta: 8, diterima: 8, hargaSatuan: 'Rp 25.000', hargaTotal: 'Rp 200.000', kondisi: 'Baik', tglExp: '2027-03-20' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Entry Penerimaan Barang</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="noInvoice" className="block text-sm font-medium text-gray-700 mb-1">No Invoice</label>
              <input
                type="text"
                id="noInvoice"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                defaultValue="INV-60"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="noPo" className="block text-sm font-medium text-gray-700 mb-1">No PO</label>
              <select
                id="noPo"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih No PO--</option>
                <option>PO001</option>
                <option>PO002</option>
                <option>PO003</option>
              </select>
            </div>
            <div>
              <label htmlFor="namaSupplier" className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier</label>
              <input
                type="text"
                id="namaSupplier"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                readOnly
              />
            </div>
            <div className="relative">
              <label htmlFor="tanggalPenerimaan" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Penerimaan</label>
              <input
                type="date"
                id="tanggalPenerimaan"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <CalendarDays className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                id="catatan"
                rows={3}
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Tambahkan catatan..."
              ></textarea>
            </div>
          </div>

          {/* Barang Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang Diminta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang Diterima</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Exp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modalBarangItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.kode}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.diminta}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <input type="number" defaultValue={item.diterima} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.hargaSatuan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.hargaTotal}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option>Baik</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <input type="date" defaultValue={item.tglExp} className="w-32 border border-gray-300 rounded-md px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md"
          >
            Kembali
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryPenerimaanBarangModal;
