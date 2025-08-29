import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, PlusCircle, Save, Trash2, Loader2 } from 'lucide-react';
import { DetailItem, KasMasukFormData } from '../types'; // Import types

interface KasMasukModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KasMasukFormData) => void;
  initialData?: KasMasukFormData | null;
  title: string;
}

const KasMasukModal: React.FC<KasMasukModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const today = new Date();
  const initialEmptyFormData: KasMasukFormData = {
    nomorJurnal: `KM-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`, // Dynamic default
    tanggal: today,
    kasAccount: 'Kas Besar',
    keteranganHeader: '',
    detailItems: [{ id: 1, coa: '', nominal: 0, keterangan: '', client: '' }],
    total: 0,
  };

  const [formData, setFormData] = useState<KasMasukFormData>(initialEmptyFormData);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const coaOptions = [
    '4101 - Pendapatan Penjualan',
    '4102 - Pendapatan Jasa',
    '1201 - Piutang Usaha',
    '5101 - Beban Gaji',
    '5102 - Beban Sewa',
    '6101 - Beban Listrik',
  ];

  const kasOptions = [
    'Kas Besar',
    'Kas Kecil',
  ];

  const clientOptions = [
    'Client A',
    'Client B',
    'Client C',
    'Client D',
    'Client E',
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setFormData(initialData ? {
        ...initialData,
        tanggal: initialData.tanggal ? new Date(initialData.tanggal) : today, // Ensure date object
        total: calculateTotal(initialData.detailItems) // Recalculate total for initial data
      } : initialEmptyFormData);
      setErrors({}); // Clear errors when opening
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      setFormData(initialEmptyFormData); // Reset form data when modal closes
      setErrors({});
    };
  }, [isOpen, onClose, initialData]);

  // Helper to calculate total from detail items
  const calculateTotal = (items: DetailItem[]) => {
    return items.reduce((sum, item) => sum + item.nominal, 0);
  };

  const handleAddDetailRow = () => {
    setFormData(prev => ({
      ...prev,
      detailItems: [...prev.detailItems, { id: prev.detailItems.length + 1, coa: '', nominal: 0, keterangan: '', client: '' }]
    }));
  };

  const handleRemoveDetailRow = (id: number) => {
    setFormData(prev => {
      const updatedItems = prev.detailItems.filter(item => item.id !== id);
      return {
        ...prev,
        detailItems: updatedItems,
        total: calculateTotal(updatedItems)
      };
    });
  };

  const handleDetailChange = (id: number, field: keyof DetailItem, value: any) => {
    setFormData(prev => {
      const updatedItems = prev.detailItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      return {
        ...prev,
        detailItems: updatedItems,
        total: calculateTotal(updatedItems)
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.nomorJurnal.trim()) {
      newErrors.nomorJurnal = 'Nomor Jurnal wajib diisi';
    }
    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }
    if (!formData.kasAccount.trim()) {
      newErrors.kasAccount = 'Akun Kas wajib dipilih';
    }
    if (!formData.keteranganHeader.trim()) {
      newErrors.keteranganHeader = 'Keterangan wajib diisi';
    }

    if (formData.detailItems.length === 0) {
      newErrors.detailItems = 'Minimal satu detail transaksi harus diisi';
    } else {
      formData.detailItems.forEach((item, index) => {
        if (!item.coa.trim()) {
          newErrors[`detailItems[${index}].coa`] = 'COA wajib dipilih';
        }
        if (item.nominal <= 0) {
          newErrors[`detailItems[${index}].nominal`] = 'Nominal harus lebih dari nol';
        }
        if (!item.keterangan.trim()) {
          newErrors[`detailItems[${index}].keterangan`] = 'Keterangan detail wajib diisi';
        }
        if (!item.client.trim()) {
          newErrors[`detailItems[${index}].client`] = 'Client wajib dipilih';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    onSave({ ...formData, total: calculateTotal(formData.detailItems) });
    setIsLoading(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="nomorJurnal" className="block text-sm font-medium text-gray-700 mb-2">Nomor Jurnal <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="nomorJurnal"
                  className={`block w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 ${errors.nomorJurnal ? 'border-red-300' : 'border-gray-300'}`}
                  value={formData.nomorJurnal}
                  readOnly
                />
                {errors.nomorJurnal && <p className="mt-1 text-sm text-red-600">{errors.nomorJurnal}</p>}
              </div>
              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal <span className="text-red-500">*</span></label>
                <DatePicker
                  selected={formData.tanggal}
                  onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tanggal: date }))}
                  dateFormat="dd/MM/yyyy"
                  className={`block w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.tanggal ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>}
              </div>
              <div>
                <label htmlFor="kasAccount" className="block text-sm font-medium text-gray-700 mb-2">Kas <span className="text-red-500">*</span></label>
                <select
                  id="kasAccount"
                  className={`block w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none ${errors.kasAccount ? 'border-red-300' : 'border-gray-300'}`}
                  value={formData.kasAccount}
                  onChange={(e) => setFormData(prev => ({ ...prev, kasAccount: e.target.value }))}
                >
                  <option value="">Pilih Akun Kas</option>
                  {kasOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.kasAccount && <p className="mt-1 text-sm text-red-600">{errors.kasAccount}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="keteranganHeader" className="block text-sm font-medium text-gray-700 mb-2">Keterangan <span className="text-red-500">*</span></label>
                <textarea
                  id="keteranganHeader"
                  rows={3}
                  className={`block w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.keteranganHeader ? 'border-red-300' : 'border-gray-300'}`}
                  value={formData.keteranganHeader}
                  onChange={(e) => setFormData(prev => ({ ...prev, keteranganHeader: e.target.value }))}
                  placeholder="Masukkan keterangan jurnal..."
                ></textarea>
                {errors.keteranganHeader && <p className="mt-1 text-sm text-red-600">{errors.keteranganHeader}</p>}
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-800 mb-4">Detail Transaksi</h4>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      COA <span className="text-red-500">*</span>
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nominal <span className="text-red-500">*</span>
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan <span className="text-red-500">*</span>
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client <span className="text-red-500">*</span>
                    </th>
                    <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.detailItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <select
                          value={item.coa}
                          onChange={(e) => handleDetailChange(item.id, 'coa', e.target.value)}
                          className={`block w-full border rounded-lg py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors[`detailItems[${index}].coa`] ? 'border-red-300' : 'border-gray-300'}`}
                        >
                          <option value="">Pilih COA</option>
                          {coaOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors[`detailItems[${index}].coa`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${index}].coa`]}</p>}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          value={item.nominal}
                          onChange={(e) => handleDetailChange(item.id, 'nominal', parseFloat(e.target.value) || 0)}
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors[`detailItems[${index}].nominal`] ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors[`detailItems[${index}].nominal`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${index}].nominal`]}</p>}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="text"
                          value={item.keterangan}
                          onChange={(e) => handleDetailChange(item.id, 'keterangan', e.target.value)}
                          className={`block w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors[`detailItems[${index}].keterangan`] ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors[`detailItems[${index}].keterangan`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${index}].keterangan`]}</p>}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <select
                          value={item.client}
                          onChange={(e) => handleDetailChange(item.id, 'client', e.target.value)}
                          className={`block w-full border rounded-lg py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors[`detailItems[${index}].client`] ? 'border-red-300' : 'border-gray-300'}`}
                        >
                          <option value="">Pilih Client</option>
                          {clientOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors[`detailItems[${index}].client`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${index}].client`]}</p>}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          type="button"
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
              {errors.detailItems && <p className="mt-1 text-sm text-red-600">{errors.detailItems}</p>}
            </div>

            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={handleAddDetailRow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Baris
              </button>
              <div className="text-lg font-bold text-gray-900">
                Total: Rp {formData.total.toLocaleString('id-ID')}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Jurnal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KasMasukModal;
