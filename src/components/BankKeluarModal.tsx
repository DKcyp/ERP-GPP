import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PlusCircle, Save, Trash2, X } from 'lucide-react';
import { BankKeluarFormData, DetailItem } from '../types';

interface BankKeluarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BankKeluarFormData) => void;
  initialData?: BankKeluarFormData | null;
  title: string;
}

const coaOptions = [
  '5101 - Beban Gaji',
  '5102 - Beban Sewa',
  '6101 - Beban Listrik',
  '1301 - Persediaan Barang Dagang',
  '2101 - Utang Usaha',
  '7101 - Beban Administrasi',
  '8101 - Beban Lain-lain',
];

const bankOptions = [
  'Bank BCA',
  'Bank Mandiri',
  'Bank BRI',
  'Bank BNI',
];

const clientOptions = [
  'Client A',
  'Client B',
  'Client C',
  'Client D',
  'Client E',
  'Internal',
  'Vendor Sewa',
  'PLN',
  'Supplier Y',
  'Vendor Z',
  'Pemasok Umum',
];

const BankKeluarModal: React.FC<BankKeluarModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const today = new Date();
  const [nomorJurnal, setNomorJurnal] = useState('');
  const [tanggal, setTanggal] = useState<Date | null>(today);
  const [bankAccount, setBankAccount] = useState(bankOptions[0]);
  const [keteranganHeader, setKeteranganHeader] = useState('');
  const [detailItems, setDetailItems] = useState<DetailItem[]>([
    { id: 1, coa: '', nominal: 0, keterangan: '', client: '' },
  ]);

  useEffect(() => {
    if (initialData) {
      setNomorJurnal(initialData.nomorJurnal);
      setTanggal(initialData.tanggal);
      setBankAccount(initialData.bankAccount);
      setKeteranganHeader(initialData.keteranganHeader);
      setDetailItems(initialData.detailItems.length > 0 ? initialData.detailItems : [{ id: 1, coa: '', nominal: 0, keterangan: '', client: '' }]);
    } else {
      // Reset form for new entry
      setNomorJurnal(`BK-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
      setTanggal(today);
      setBankAccount(bankOptions[0]);
      setKeteranganHeader('');
      setDetailItems([{ id: 1, coa: '', nominal: 0, keterangan: '', client: '' }]);
    }
  }, [initialData, isOpen]); // Reset when modal opens or initialData changes

  if (!isOpen) return null;

  const handleAddDetailRow = () => {
    setDetailItems([...detailItems, { id: detailItems.length + 1, coa: '', nominal: 0, keterangan: '', client: '' }]);
  };

  const handleRemoveDetailRow = (id: number) => {
    setDetailItems(detailItems.filter(item => item.id !== id));
  };

  const handleDetailChange = (id: number, field: keyof DetailItem, value: any) => {
    setDetailItems(detailItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return detailItems.reduce((sum, item) => sum + item.nominal, 0);
  };

  const handleSubmit = () => {
    const dataToSave: BankKeluarFormData = {
      id: initialData?.id, // Preserve ID if editing
      nomorJurnal,
      tanggal,
      bankAccount,
      keteranganHeader,
      detailItems,
      total: calculateTotal(),
    };
    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="nomorJurnal" className="block text-sm font-medium text-gray-700 mb-2">Nomor Jurnal</label>
              <input
                type="text"
                id="nomorJurnal"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                value={nomorJurnal}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <DatePicker
                selected={tanggal}
                onChange={(date: Date | null) => setTanggal(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">Bank</label>
              <select
                id="bankAccount"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              >
                {bankOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="keteranganHeader" className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <textarea
                id="keteranganHeader"
                rows={3}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={keteranganHeader}
                onChange={(e) => setKeteranganHeader(e.target.value)}
                placeholder="Masukkan keterangan jurnal..."
              ></textarea>
            </div>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-4">Detail Transaksi</h4>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COA
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detailItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={item.coa}
                        onChange={(e) => handleDetailChange(item.id, 'coa', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih COA</option>
                        {coaOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="number"
                        value={item.nominal}
                        onChange={(e) => handleDetailChange(item.id, 'nominal', parseFloat(e.target.value) || 0)}
                        className="block w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="text"
                        value={item.keterangan}
                        onChange={(e) => handleDetailChange(item.id, 'keterangan', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={item.client}
                        onChange={(e) => handleDetailChange(item.id, 'client', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih Client</option>
                        {clientOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleRemoveDetailRow(item.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleAddDetailRow}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Baris
            </button>
            <div className="text-lg font-bold text-gray-900">
              Total: Rp {calculateTotal().toLocaleString('id-ID')}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" /> Simpan Jurnal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankKeluarModal;
