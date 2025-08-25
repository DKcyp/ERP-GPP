import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ManPowerFormData } from '../types';

interface ManPowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ManPowerFormData) => void;
}

const ManPowerModal: React.FC<ManPowerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ManPowerFormData>({
    // Step 1: Data Pemohon
    untukKebutuhanSOTurunan: '',
    namaPemohon: '',
    mob: '',
    demob: '',
    jabatan: 'Dir. Operasional',
    departemen: 'Operasional',
    
    // Step 2: Permintaan Tenaga Kerja
    penggantian: 'Ya',
    penambahan: 'Ya',
    headHunter: 'Ya',
    perluHasilMedicalCheckUp: 'Ya',
    statusKepegawaian: 'Tetap',
    
    // Step 3: Kebutuhan Tenaga Kerja
    tanggalMulaiKerja: '',
    lokasiKerja: '',
    kebutuhanTenagaKerja: [{
      jabatan: 'Welder',
      level: 'Level 3',
      jumlahKebutuhan: '',
      rateKualifikasi: '',
      gajiPokok: '',
      tunjanganJabatan: '',
      tunjanganLain: ''
    }],
    
    // Step 4: Jabatan Tenaga Kerja
    deskripsiJabatan: '',
    
    // Step 5: Kualifikasi Tenaga Kerja
    usiaMin: '',
    usiaMax: '',
    status: 'Menikah',
    jenisKelamin: 'Laki-laki',
    pendidikan: 'SMA/SMK',
    keahlian: '',
    kemampuanLainnya: ''
  });

  const [errors, setErrors] = useState<Partial<ManPowerFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    'Data Pemohon',
    'Permintaan Tenaga Kerja',
    'Kebutuhan Tenaga Kerja',
    'Jabatan Tenaga Kerja',
    'Kualifikasi Tenaga Kerja'
  ];

  const soTurunanOptions = [
    'SO001.1',
    'SO001.2',
    'SO002.1',
    'SO003.1',
    'SO004.1'
  ];

  const namaPemohonOptions = [
    'Ahmad Rizki',
    'Sari Dewi',
    'Budi Santoso',
    'Maya Putri',
    'Andi Wijaya'
  ];

  const jabatanOptions = [
    'Welder',
    'Pipe Fitter',
    'Quality Inspector',
    'Supervisor',
    'Engineer'
  ];

  const levelOptions = [
    'Level 1',
    'Level 2',
    'Level 3',
    'Level 4',
    'Level 5'
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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field: keyof ManPowerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleKebutuhanTenagaKerjaChange = (index: number, field: string, value: string) => {
    const newKebutuhan = [...formData.kebutuhanTenagaKerja];
    newKebutuhan[index] = { ...newKebutuhan[index], [field]: value };
    setFormData(prev => ({ ...prev, kebutuhanTenagaKerja: newKebutuhan }));
  };

  const addKebutuhanTenagaKerja = () => {
    setFormData(prev => ({
      ...prev,
      kebutuhanTenagaKerja: [...prev.kebutuhanTenagaKerja, {
        jabatan: 'Welder',
        level: 'Level 3',
        jumlahKebutuhan: '',
        rateKualifikasi: '',
        gajiPokok: '',
        tunjanganJabatan: '',
        tunjanganLain: ''
      }]
    }));
  };

  const removeKebutuhanTenagaKerja = (index: number) => {
    if (formData.kebutuhanTenagaKerja.length > 1) {
      setFormData(prev => ({
        ...prev,
        kebutuhanTenagaKerja: prev.kebutuhanTenagaKerja.filter((_, i) => i !== index)
      }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<ManPowerFormData> = {};

    switch (currentStep) {
      case 1:
        if (!formData.untukKebutuhanSOTurunan) {
          newErrors.untukKebutuhanSOTurunan = 'SO Turunan wajib dipilih';
        }
        if (!formData.namaPemohon) {
          newErrors.namaPemohon = 'Nama Pemohon wajib dipilih';
        }
        if (!formData.mob) {
          newErrors.mob = 'MOB wajib diisi';
        }
        if (!formData.demob) {
          newErrors.demob = 'DEMOB wajib diisi';
        }
        break;
      case 3:
        if (!formData.tanggalMulaiKerja) {
          newErrors.tanggalMulaiKerja = 'Tanggal Mulai Kerja wajib diisi';
        }
        if (!formData.lokasiKerja) {
          newErrors.lokasiKerja = 'Lokasi Kerja wajib diisi';
        }
        break;
      case 5:
        if (!formData.usiaMin) {
          newErrors.usiaMin = 'Usia minimum wajib diisi';
        }
        if (!formData.usiaMax) {
          newErrors.usiaMax = 'Usia maximum wajib diisi';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTabClick = (tabIndex: number) => {
    setCurrentStep(tabIndex + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(formData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      untukKebutuhanSOTurunan: '',
      namaPemohon: '',
      mob: '',
      demob: '',
      jabatan: 'Dir. Operasional',
      departemen: 'Operasional',
      penggantian: 'Ya',
      penambahan: 'Ya',
      headHunter: 'Ya',
      perluHasilMedicalCheckUp: 'Ya',
      statusKepegawaian: 'Tetap',
      tanggalMulaiKerja: '',
      lokasiKerja: '',
      kebutuhanTenagaKerja: [{
        jabatan: 'Welder',
        level: 'Level 3',
        jumlahKebutuhan: '',
        rateKualifikasi: '',
        gajiPokok: '',
        tunjanganJabatan: '',
        tunjanganLain: ''
      }],
      deskripsiJabatan: '',
      usiaMin: '',
      usiaMax: '',
      status: 'Menikah',
      jenisKelamin: 'Laki-laki',
      pendidikan: 'SMA/SMK',
      keahlian: '',
      kemampuanLainnya: ''
    });
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Untuk Kebutuhan SO Turunan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Untuk Kebutuhan SO Turunan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.untukKebutuhanSOTurunan}
                onChange={(e) => handleInputChange('untukKebutuhanSOTurunan', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.untukKebutuhanSOTurunan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">--Pilih No SO Turunan--</option>
                {soTurunanOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.untukKebutuhanSOTurunan && (
                <p className="mt-1 text-sm text-red-600">{errors.untukKebutuhanSOTurunan}</p>
              )}
            </div>

            {/* MOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MOB <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.mob}
                  onChange={(e) => handleInputChange('mob', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.mob ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.mob && (
                <p className="mt-1 text-sm text-red-600">{errors.mob}</p>
              )}
            </div>

            {/* Nama Pemohon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pemohon <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.namaPemohon}
                onChange={(e) => handleInputChange('namaPemohon', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.namaPemohon ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">--Pilih Nama Pemohon--</option>
                {namaPemohonOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.namaPemohon && (
                <p className="mt-1 text-sm text-red-600">{errors.namaPemohon}</p>
              )}
            </div>

            {/* DEMOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DEMOB <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.demob}
                  onChange={(e) => handleInputChange('demob', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.demob ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.demob && (
                <p className="mt-1 text-sm text-red-600">{errors.demob}</p>
              )}
            </div>

            {/* Jabatan (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700"
              />
            </div>

            {/* Departemen (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen
              </label>
              <input
                type="text"
                value={formData.departemen}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Penggantian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Penggantian
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="penggantian"
                      value="Ya"
                      checked={formData.penggantian === 'Ya'}
                      onChange={(e) => handleInputChange('penggantian', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ya</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="penggantian"
                      value="Tidak"
                      checked={formData.penggantian === 'Tidak'}
                      onChange={(e) => handleInputChange('penggantian', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>

              {/* Head Hunter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Head Hunter
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="headHunter"
                      value="Ya"
                      checked={formData.headHunter === 'Ya'}
                      onChange={(e) => handleInputChange('headHunter', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ya</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="headHunter"
                      value="Tidak"
                      checked={formData.headHunter === 'Tidak'}
                      onChange={(e) => handleInputChange('headHunter', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>

              {/* Status Kepegawaian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status Kepegawaian
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="statusKepegawaian"
                      value="Tetap"
                      checked={formData.statusKepegawaian === 'Tetap'}
                      onChange={(e) => handleInputChange('statusKepegawaian', e.target.value as 'Tetap' | 'Kontrak' | 'Magang')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tetap</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="statusKepegawaian"
                      value="Kontrak"
                      checked={formData.statusKepegawaian === 'Kontrak'}
                      onChange={(e) => handleInputChange('statusKepegawaian', e.target.value as 'Tetap' | 'Kontrak' | 'Magang')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Kontrak</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="statusKepegawaian"
                      value="Magang"
                      checked={formData.statusKepegawaian === 'Magang'}
                      onChange={(e) => handleInputChange('statusKepegawaian', e.target.value as 'Tetap' | 'Kontrak' | 'Magang')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Magang</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Penambahan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Penambahan
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="penambahan"
                      value="Ya"
                      checked={formData.penambahan === 'Ya'}
                      onChange={(e) => handleInputChange('penambahan', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ya</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="penambahan"
                      value="Tidak"
                      checked={formData.penambahan === 'Tidak'}
                      onChange={(e) => handleInputChange('penambahan', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>

              {/* Perlu Hasil Medical Check Up */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Perlu Hasil Medical Check Up
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="perluHasilMedicalCheckUp"
                      value="Ya"
                      checked={formData.perluHasilMedicalCheckUp === 'Ya'}
                      onChange={(e) => handleInputChange('perluHasilMedicalCheckUp', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ya</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="perluHasilMedicalCheckUp"
                      value="Tidak"
                      checked={formData.perluHasilMedicalCheckUp === 'Tidak'}
                      onChange={(e) => handleInputChange('perluHasilMedicalCheckUp', e.target.value as 'Ya' | 'Tidak')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Date and Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tanggal Mulai Kerja */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai Kerja <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalMulaiKerja}
                    onChange={(e) => handleInputChange('tanggalMulaiKerja', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalMulaiKerja ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalMulaiKerja && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggalMulaiKerja}</p>
                )}
              </div>

              {/* Lokasi Kerja */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Kerja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lokasiKerja}
                  onChange={(e) => handleInputChange('lokasiKerja', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.lokasiKerja ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan lokasi kerja"
                />
                {errors.lokasiKerja && (
                  <p className="mt-1 text-sm text-red-600">{errors.lokasiKerja}</p>
                )}
              </div>
            </div>

            {/* Kebutuhan Tenaga Kerja Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Kebutuhan Tenaga Kerja
                </label>
                <button
                  type="button"
                  onClick={addKebutuhanTenagaKerja}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah</span>
                </button>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jabatan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Level</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jumlah Kebutuhan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate Kualifikasi</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gaji Pokok</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan Jabatan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan Lain</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.kebutuhanTenagaKerja.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <select
                            value={item.jabatan}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'jabatan', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {jabatanOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.level}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'level', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {levelOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.jumlahKebutuhan}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'jumlahKebutuhan', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.rateKualifikasi}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'rateKualifikasi', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Rate"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.gajiPokok}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'gajiPokok', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Gaji"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.tunjanganJabatan}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'tunjanganJabatan', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tunjangan"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.tunjanganLain}
                            onChange={(e) => handleKebutuhanTenagaKerjaChange(index, 'tunjanganLain', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tunjangan"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeKebutuhanTenagaKerja(index)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={formData.kebutuhanTenagaKerja.length === 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Jabatan
              </label>
              <textarea
                value={formData.deskripsiJabatan}
                onChange={(e) => handleInputChange('deskripsiJabatan', e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Masukkan deskripsi jabatan..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Usia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Usia <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.usiaMin}
                    onChange={(e) => handleInputChange('usiaMin', e.target.value)}
                    className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.usiaMin ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Min"
                  />
                  <span className="text-sm text-gray-500 font-medium">Tahun</span>
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="number"
                    value={formData.usiaMax}
                    onChange={(e) => handleInputChange('usiaMax', e.target.value)}
                    className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.usiaMax ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Max"
                  />
                  <span className="text-sm text-gray-500 font-medium">Tahun</span>
                </div>
                {(errors.usiaMin || errors.usiaMax) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.usiaMin || errors.usiaMax}
                  </p>
                )}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jenis Kelamin
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Laki-laki"
                      checked={formData.jenisKelamin === 'Laki-laki'}
                      onChange={(e) => handleInputChange('jenisKelamin', e.target.value as 'Laki-laki' | 'Perempuan')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Laki Laki</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Perempuan"
                      checked={formData.jenisKelamin === 'Perempuan'}
                      onChange={(e) => handleInputChange('jenisKelamin', e.target.value as 'Laki-laki' | 'Perempuan')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Perempuan</span>
                  </label>
                </div>
              </div>

              {/* Pendidikan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pendidikan
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pendidikan"
                      value="SMA/SMK"
                      checked={formData.pendidikan === 'SMA/SMK'}
                      onChange={(e) => handleInputChange('pendidikan', e.target.value as 'SMA/SMK' | 'D3' | 'S1')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMA/SMK</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pendidikan"
                      value="D3"
                      checked={formData.pendidikan === 'D3'}
                      onChange={(e) => handleInputChange('pendidikan', e.target.value as 'SMA/SMK' | 'D3' | 'S1')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">D3</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pendidikan"
                      value="S1"
                      checked={formData.pendidikan === 'S1'}
                      onChange={(e) => handleInputChange('pendidikan', e.target.value as 'SMA/SMK' | 'D3' | 'S1')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">S1</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Menikah"
                      checked={formData.status === 'Menikah'}
                      onChange={(e) => handleInputChange('status', e.target.value as 'Menikah' | 'Lajang')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Menikah</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Lajang"
                      checked={formData.status === 'Lajang'}
                      onChange={(e) => handleInputChange('status', e.target.value as 'Menikah' | 'Lajang')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Lajang</span>
                  </label>
                </div>
              </div>

              {/* Keahlian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keahlian
                </label>
                <textarea
                  value={formData.keahlian}
                  onChange={(e) => handleInputChange('keahlian', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan keahlian..."
                />
              </div>

              {/* Kemampuan Lainnya */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Lainnya
                </label>
                <textarea
                  value={formData.kemampuanLainnya}
                  onChange={(e) => handleInputChange('kemampuanLainnya', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan kemampuan lainnya..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Man Power</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
          >
            Kembali
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Sub Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Entry Man Power</h3>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(index)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                      currentStep === index + 1
                        ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 font-medium text-sm"
            >
              Kembali
            </button>
          </div>
          
          <div className="flex space-x-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
              >
                <span>Lanjut</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
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
                    <span>Submit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManPowerModal;
