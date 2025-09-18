import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EvaluasiVendorFormData } from '../types';

interface EvaluasiVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluasiVendorFormData) => void;
}

const EvaluasiVendorModal: React.FC<EvaluasiVendorModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Data Vendor
    namaVendor: '',
    tanggal: '',
    alamatKantor: '',
    telepon: '',
    fax: '',
    email: '',
    
    // Contact Person
    direktur: '',
    direkturEmail: '',
    operationManager: '',
    operationManagerEmail: '',
    qcManager: '',
    qcManagerEmail: '',
    financeManager: '',
    financeManagerEmail: '',
    salesManager: '',
    salesManagerEmail: '',
    
    // Jam Kerja
    jamKerjaKantor: '',
    jamKerjaPabrik: '',
    
    // Administrasi dan Perijinan
    siup: { ada: false, tidakAda: false },
    npwp: { ada: false, tidakAda: false },
    tdr: { ada: false, tidakAda: false },
    aktePendirian: { ada: false, tidakAda: false },
    domisili: { ada: false, tidakAda: false },
    csms: { ada: false, tidakAda: false },
    
    // Legacy fields for compatibility
    barangOnTime: 'Ya',
    sesuaiSpesifikasi: 'Ya',
    jumlahBarangSesuaiPO: '',
    mutu: 'Baik',
    k3: 'Ya',
    
    // After Sales fields
    tanggalGaransi: '',
    keteranganAdministrasiVendor: '',
  });

  const vendorOptions = [
    { value: 'Vendor A', label: 'Vendor A' },
    { value: 'Vendor B', label: 'Vendor B' },
    { value: 'Vendor C', label: 'Vendor C' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: string, type: 'ada' | 'tidakAda') => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: !prev[category as keyof typeof prev][type],
        [type === 'ada' ? 'tidakAda' : 'ada']: false // Uncheck the other option
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to legacy format for compatibility
    const legacyData: EvaluasiVendorFormData = {
      namaVendor: formData.namaVendor,
      barangOnTime: formData.barangOnTime as 'Ya' | 'Tidak',
      sesuaiSpesifikasi: formData.sesuaiSpesifikasi as 'Ya' | 'Tidak',
      jumlahBarangSesuaiPO: formData.jumlahBarangSesuaiPO,
      mutu: formData.mutu as 'Baik' | 'Cukup' | 'Kurang',
      k3: formData.k3 as 'Ya' | 'Tidak',
      tanggalGaransi: formData.tanggalGaransi,
      keteranganAdministrasiVendor: formData.keteranganAdministrasiVendor,
    };
    onSubmit(legacyData);
    
    // Reset form
    setFormData({
      namaVendor: '',
      tanggal: '',
      alamatKantor: '',
      telepon: '',
      fax: '',
      email: '',
      direktur: '',
      direkturEmail: '',
      operationManager: '',
      operationManagerEmail: '',
      qcManager: '',
      qcManagerEmail: '',
      financeManager: '',
      financeManagerEmail: '',
      salesManager: '',
      salesManagerEmail: '',
      jamKerjaKantor: '',
      jamKerjaPabrik: '',
      siup: { ada: false, tidakAda: false },
      npwp: { ada: false, tidakAda: false },
      tdr: { ada: false, tidakAda: false },
      aktePendirian: { ada: false, tidakAda: false },
      domisili: { ada: false, tidakAda: false },
      csms: { ada: false, tidakAda: false },
      barangOnTime: 'Ya',
      sesuaiSpesifikasi: 'Ya',
      jumlahBarangSesuaiPO: '',
      mutu: 'Baik',
      k3: 'Ya',
      tanggalGaransi: '',
      keteranganAdministrasiVendor: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-3 text-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">DATA VENDOR / SUB KONTRAKTOR</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Data Vendor */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm">DATA VENDOR / SUB KONTRAKTOR</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><label>Nama Vendor:</label><input name="namaVendor" value={formData.namaVendor} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Tanggal:</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Alamat Kantor:</label><input name="alamatKantor" value={formData.alamatKantor} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Telepon:</label><input name="telepon" value={formData.telepon} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Fax:</label><input name="fax" value={formData.fax} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>E-Mail:</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border px-2 py-1" /></div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm">CONTACT PERSON</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><label>1. Direktur/Penanggung Jawab:</label><input name="direktur" value={formData.direktur} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Email:</label><input type="email" name="direkturEmail" value={formData.direkturEmail} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>2. Operation Manager:</label><input name="operationManager" value={formData.operationManager} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Email:</label><input type="email" name="operationManagerEmail" value={formData.operationManagerEmail} onChange={handleChange} className="w-full border px-2 py-1" /></div>
            </div>
          </div>

          {/* Jam Kerja */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm">JAM KERJA</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><label>Jam kerja kantor: s/d</label><input name="jamKerjaKantor" value={formData.jamKerjaKantor} onChange={handleChange} className="w-full border px-2 py-1" /></div>
              <div><label>Jam kerja pabrik/gudang: s/d</label><input name="jamKerjaPabrik" value={formData.jamKerjaPabrik} onChange={handleChange} className="w-full border px-2 py-1" /></div>
            </div>
          </div>

          {/* Administrasi */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm">A. Administrasi dan Perijinan</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div></div><div className="text-center font-medium">Ada</div><div className="text-center font-medium">Tidak ada</div>
              {['SIUP', 'NPWP', 'TDR', 'AKTE PENDIRIAN', 'DOMISILI', 'CSMS'].map(item => (
                <React.Fragment key={item}>
                  <div className="font-medium">{item}</div>
                  <div className="text-center"><input type="checkbox" checked={formData[item.toLowerCase().replace(' ', '')]?.ada || false} onChange={() => handleCheckboxChange(item.toLowerCase().replace(' ', ''), 'ada')} /></div>
                  <div className="text-center"><input type="checkbox" checked={formData[item.toLowerCase().replace(' ', '')]?.tidakAda || false} onChange={() => handleCheckboxChange(item.toLowerCase().replace(' ', ''), 'tidakAda')} /></div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* After Sales Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm">AFTER SALES</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Garansi</label>
                <input
                  type="date"
                  name="tanggalGaransi"
                  value={formData.tanggalGaransi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Administrasi Vendor</label>
                <textarea
                  name="keteranganAdministrasiVendor"
                  value={formData.keteranganAdministrasiVendor}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan keterangan administrasi vendor..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 -mx-4 px-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluasiVendorModal;
