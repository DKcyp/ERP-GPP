import React, { useState } from 'react';
import { X, CalendarDays, Upload, Plus } from 'lucide-react';
import { EntryPOBarangFormData, POBarangItemEntry } from '../types';

interface EntryPOBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntryPOBarangFormData) => void;
}

const EntryPOBarangModal: React.FC<EntryPOBarangModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EntryPOBarangFormData>({
    noPR: '',
    noSO: '',
    metodePembayaran: '',
    termOfPayment: '',
    tanggalPO: '',
    kodeVendor: '',
    tanggalPengiriman: '',
    noPO: 'PO070', // Pre-filled as per image
    departemen: '',
    vendor: '',
    pajak: '',
    tandaBukti: null,
    daftarFile: [],
    items: [
      {
        id: '1',
        namaBarang: '',
        kodeBarang: '',
        qty: '',
        satuan: '',
        hargaSatuan: '',
        pajakItem: '',
        discRp: '',
        jumlah: '',
        keterangan: '',
        sertifikat: false,
      },
    ],
    total: 'Rp 1.500.000',
    discAkhir: 'Rp 50.000',
    subTotal: 'Rp 1.450.000',
    ppn: 'Rp 145.000',
    uangMukaNominal: '',
    ongkosKirim: '',
    grandTotal: 'Rp 1.595.000',
    // new fields
    grossUp: false,
    pphSummary: '',
    biayaLainLain: '',
    biayaMaterai: '',
    estimasiKedatangan: '',
  });

  const metodePembayaranOptions = [
    { value: 'Transfer Bank', label: 'Transfer Bank' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Giro', label: 'Giro' },
  ];

  const pajakOptions = [
    { value: 'PPN', label: 'PPN' },
    { value: 'Non PPN', label: 'Non PPN' },
  ];

  const pphSummaryOptions = [
    { value: 'Tidak', label: 'Tidak' },
    { value: 'PPh 21', label: 'PPh 21' },
    { value: 'PPh 23', label: 'PPh 23' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'tandaBukti') {
        setFormData((prev) => ({ ...prev, tandaBukti: files[0] }));
      } else if (name === 'daftarFile') {
        setFormData((prev) => ({ ...prev, daftarFile: Array.from(files) }));
      }
    }
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleItemCheckboxChange = (index: number, name: keyof POBarangItemEntry, checked: boolean) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: checked } as POBarangItemEntry;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: (prev.items.length + 1).toString(),
          namaBarang: '',
          kodeBarang: '',
          qty: '',
          satuan: '',
          hargaSatuan: '',
          pajakItem: '',
          discRp: '',
          jumlah: '',
          keterangan: '',
          sertifikat: false,
        },
      ],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Optionally reset form after submission
    setFormData({
      noPR: '',
      noSO: '',
      metodePembayaran: '',
      termOfPayment: '',
      tanggalPO: '',
      kodeVendor: '',
      tanggalPengiriman: '',
      noPO: 'PO070',
      departemen: '',
      vendor: '',
      pajak: '',
      tandaBukti: null,
      daftarFile: [],
      items: [
        {
          id: '1',
          namaBarang: '',
          kodeBarang: '',
          qty: '',
          satuan: '',
          hargaSatuan: '',
          pajakItem: '',
          discRp: '',
          jumlah: '',
          keterangan: '',
          sertifikat: false,
        },
      ],
      total: 'Rp 1.500.000',
      discAkhir: 'Rp 50.000',
      subTotal: 'Rp 1.450.000',
      ppn: 'Rp 145.000',
      uangMukaNominal: '',
      ongkosKirim: '',
      grandTotal: 'Rp 1.595.000',
      grossUp: false,
      pphSummary: '',
      biayaLainLain: '',
      biayaMaterai: '',
      estimasiKedatangan: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Entry PO Barang</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Top Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="noPR" className="block text-sm font-medium text-gray-700 mb-1">No PR</label>
                <input
                  type="text"
                  id="noPR"
                  name="noPR"
                  value={formData.noPR}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="tanggalPO" className="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label>
                <div className="relative">
                  <input
                    type="text"
                    id="tanggalPO"
                    name="tanggalPO"
                    value={formData.tanggalPO}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="noPO" className="block text-sm font-medium text-gray-700 mb-1">No PO</label>
                <input
                  type="text"
                  id="noPO"
                  name="noPO"
                  value={formData.noPO}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  id="vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-1">No SO</label>
                <input
                  type="text"
                  id="noSO"
                  name="noSO"
                  value={formData.noSO}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="kodeVendor" className="block text-sm font-medium text-gray-700 mb-1">Kode Vendor</label>
                <input
                  type="text"
                  id="kodeVendor"
                  name="kodeVendor"
                  value={formData.kodeVendor}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                <input
                  type="text"
                  id="departemen"
                  name="departemen"
                  value={formData.departemen}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="pajak" className="block text-sm font-medium text-gray-700 mb-1">Pajak</label>
                <select
                  id="pajak"
                  name="pajak"
                  value={formData.pajak}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Pilih Pajak</option>
                  {pajakOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label htmlFor="metodePembayaran" className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select
                  id="metodePembayaran"
                  name="metodePembayaran"
                  value={formData.metodePembayaran}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  {metodePembayaranOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Term Of Payment (free text) */}
              <div>
                <label htmlFor="termOfPayment" className="block text-sm font-medium text-gray-700 mb-1">Term Of Payment</label>
                <input
                  type="text"
                  id="termOfPayment"
                  name="termOfPayment"
                  value={formData.termOfPayment || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 30 hari setelah invoice"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Tanggal Pengiriman */}
              <div>
                <label htmlFor="tanggalPengiriman" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengiriman</label>
                <div className="relative">
                  <input
                    type="text"
                    id="tanggalPengiriman"
                    name="tanggalPengiriman"
                    value={formData.tanggalPengiriman}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="estimasiKedatangan" className="block text-sm font-medium text-gray-700 mb-1">Estimasi Kedatangan</label>
                <div className="relative">
                  <input
                    type="text"
                    id="estimasiKedatangan"
                    name="estimasiKedatangan"
                    value={formData.estimasiKedatangan || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="tandaBukti" className="block text-sm font-medium text-gray-700 mb-1">Tanda Bukti</label>
                <div className="flex items-center space-x-2">
                  <label htmlFor="tandaBuktiInput" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 text-sm">
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="tandaBuktiInput"
                    name="tandaBukti"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.tandaBukti ? formData.tandaBukti.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Daftar File Drag & Drop */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Daftar File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Drag & Drop your files or Browse</span>
                      <input id="file-upload" name="daftarFile" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {formData.daftarFile.length > 0 && (
                    <ul className="text-sm text-gray-700 mt-2">
                      {formData.daftarFile.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table Section */}
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sertifikat</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pajak</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc (Rp)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <input type="text" name="namaBarang" value={item.namaBarang} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="kodeBarang" value={item.kodeBarang} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.sertifikat ? 'Yes' : 'No'}
                            onChange={(e) => handleItemCheckboxChange(index, 'sertifikat', e.target.value === 'Yes')}
                            className="w-full border-0 focus:ring-0 text-sm"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="satuan" value={item.satuan} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="hargaSatuan" value={item.hargaSatuan} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="pajakItem" value={item.pajakItem} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="discRp" value={item.discRp} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="jumlah" value={item.jumlah} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                        <td className="p-2">
                          <input type="text" name="keterangan" value={item.keterangan} onChange={(e) => handleItemChange(index, e)} className="w-full border-0 focus:ring-0 text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-2 bg-gray-50 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Tambah Item</span>
                </button>
              </div>
            </div>

            {/* Summary Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 self-end w-full md:w-1/2 ml-auto">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Gross Up:</span>
                <select
                  name="grossUp"
                  value={formData.grossUp ? 'Yes' : 'No'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, grossUp: e.target.value === 'Yes' }))}
                  className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>PPh:</span>
                <select
                  name="pphSummary"
                  value={formData.pphSummary || ''}
                  onChange={handleChange}
                  className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Pilih</option>
                  {pphSummaryOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Biaya Lain-lain:</span>
                <input
                  type="text"
                  name="biayaLainLain"
                  value={formData.biayaLainLain || ''}
                  onChange={handleChange}
                  placeholder="Rp 0"
                  className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Biaya Materai:</span>
                <input
                  type="text"
                  name="biayaMaterai"
                  value={formData.biayaMaterai || ''}
                  onChange={handleChange}
                  placeholder="Rp 0"
                  className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Total:</span>
                <input type="text" value={formData.total} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Disc Akhir:</span>
                <input type="text" value={formData.discAkhir} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Sub Total:</span>
                <input type="text" value={formData.subTotal} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>PPN:</span>
                <input type="text" value={formData.ppn} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" />
              </div>
              {/* Uang Muka Nominal (baru) */}
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Uang Muka:</span>
                <input
                  type="text"
                  name="uangMukaNominal"
                  value={formData.uangMukaNominal || ''}
                  onChange={handleChange}
                  placeholder="Rp 0"
                  className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Ongkos Kirim:</span>
                <input
                  type="text"
                  name="ongkosKirim"
                  value={formData.ongkosKirim}
                  onChange={handleChange}
                  placeholder="Masukkan Ongkos Kirim"
                  className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Grand Total:</span>
                <input type="text" value={formData.grandTotal} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryPOBarangModal;
