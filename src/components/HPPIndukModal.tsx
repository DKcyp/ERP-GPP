import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface HPPIndukModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HPPIndukFormData) => void;
}

export interface HPPIndukFormData {
  noKontrak: string;
  durasiKontrak: string;
  namaClient: string;
  lokasiPekerjaan: string;
  namaProject: string;
  jenisPekerjaan: string;
  estimasiNilaiKontrak: string;
  activeTab: string;
  tenagaKerja: Array<{
    tenaga: string;
    tunjangan: string; // Renamed from gajiPokok, now an input
    projectRate: string;
    hari: string;
    hargaAwal: string; // New input field, replaces hpp
    margin: string;
    hargaAkhir: string; // New calculated field, replaces hargaPenawaran
  }>;
  jasa: Array<{
    jasa: string;
    tunjangan: string;
    projectRate: string;
    hari: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  alat: Array<{
    alat: string;
    harga: string;
    jumlah: string;
    hari: string;
    satuan: string;
    hargaSatuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  barang: Array<{
    namaBarang: string;
    harga: string;
    jumlah: string;
    hari: string;
    satuan: string;
    hargaSatuan: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  mobDemob: Array<{
    namaTransportasi: string;
    tunjangan: string;
    projectRate: string;
    hari: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
  biayaLainLain: Array<{
    namaBiaya: string;
    tunjangan: string;
    projectRate: string;
    hari: string;
    hargaAwal: string;
    margin: string;
    hargaAkhir: string;
  }>;
}

interface CategorySummary {
  category: string;
  totalHargaAwal: number;
  totalMarginValue: number;
  totalHargaAkhir: number;
}

const HPPIndukModal: React.FC<HPPIndukModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<HPPIndukFormData>({
    noKontrak: '',
    durasiKontrak: '',
    namaClient: '',
    lokasiPekerjaan: '',
    namaProject: '',
    jenisPekerjaan: 'On Call',
    estimasiNilaiKontrak: '',
    activeTab: 'Tenaga Kerja',
    tenagaKerja: [
      { tenaga: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }
    ],
    jasa: [{ jasa: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
    alat: [{ alat: '', harga: '', jumlah: '', hari: '', satuan: '', hargaSatuan: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
    barang: [{ namaBarang: '', harga: '', jumlah: '', hari: '', satuan: '', hargaSatuan: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
    mobDemob: [{ namaTransportasi: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
    biayaLainLain: [{ namaBiaya: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
  });

  const [errors, setErrors] = useState<Partial<HPPIndukFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = [
    'Client A',
    'PT Teknologi Maju',
    'CV Digital Solutions',
    'PT Industri Kreatif',
    'UD Berkah Jaya',
    'PT Global Mandiri'
  ];

  const jenisPekerjaanOptions = ['On Call', 'Project Based', 'Maintenance', 'Consulting'];

  const tabs = ['Tenaga Kerja', 'Jasa', 'Alat', 'Barang', 'MobDemob', 'Biaya Lain-lain', 'Sisa HPP'];

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseCurrency = (value: string): number => {
    const cleanedValue = value.replace(/[^0-9,-]+/g, '').replace(',', '.');
    return parseFloat(cleanedValue) || 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<HPPIndukFormData> = {};

    if (!formData.noKontrak.trim()) {
      newErrors.noKontrak = 'No Kontrak wajib diisi';
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = 'Nama Client wajib diisi';
    }

    if (!formData.namaProject.trim()) {
      newErrors.namaProject = 'Nama Project wajib diisi';
    }

    if (!formData.lokasiPekerjaan.trim()) {
      newErrors.lokasiPekerjaan = 'Lokasi Pekerjaan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof HPPIndukFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getCurrentTabData = () => {
    switch (formData.activeTab) {
      case 'Tenaga Kerja': return formData.tenagaKerja;
      case 'Jasa': return formData.jasa;
      case 'Alat': return formData.alat;
      case 'Barang': return formData.barang;
      case 'MobDemob': return formData.mobDemob;
      case 'Biaya Lain-lain': return formData.biayaLainLain;
      default: return [];
    }
  };

  const handleTabDataChange = (index: number, field: string, value: string) => {
    const currentTab = formData.activeTab;
    let newData: any[] = [];
    
    switch (currentTab) {
      case 'Tenaga Kerja':
        newData = [...formData.tenagaKerja];
        newData[index] = { ...newData[index], [field]: value };
        // Auto calculate harga akhir if margin and harga awal are provided
        if (field === 'margin' || field === 'hargaAwal') {
          const hargaAwal = parseCurrency(field === 'hargaAwal' ? value : newData[index].hargaAwal);
          const margin = parseFloat(field === 'margin' ? value : newData[index].margin) || 0;
          const hargaAkhir = hargaAwal + (hargaAwal * margin / 100);
          newData[index].hargaAkhir = hargaAkhir.toFixed(0);
        }
        setFormData(prev => ({ ...prev, tenagaKerja: newData }));
        break;
      case 'Jasa':
        newData = [...formData.jasa];
        newData[index] = { ...newData[index], [field]: value };
        // Auto calculate harga akhir if margin and harga awal are provided
        if (field === 'margin' || field === 'hargaAwal') {
          const hargaAwal = parseCurrency(field === 'hargaAwal' ? value : newData[index].hargaAwal);
          const margin = parseFloat(field === 'margin' ? value : newData[index].margin) || 0;
          const hargaAkhir = hargaAwal + (hargaAwal * margin / 100);
          newData[index].hargaAkhir = hargaAkhir.toFixed(0);
        }
        setFormData(prev => ({ ...prev, jasa: newData }));
        break;
      case 'Alat':
        newData = [...formData.alat];
        newData[index] = { ...newData[index], [field]: value };
        // Auto calculate harga satuan for Alat and Barang tabs
        if ((currentTab === 'Alat' || currentTab === 'Barang') && (field === 'harga' || field === 'jumlah')) {
          const harga = parseCurrency(field === 'harga' ? value : newData[index].harga);
          const jumlah = parseFloat(field === 'jumlah' ? value : newData[index].jumlah) || 0;
          if (jumlah > 0) {
            newData[index].hargaSatuan = (harga / jumlah).toFixed(0);
          } else {
            newData[index].hargaSatuan = '0';
          }
        }
        // Auto calculate harga akhir if margin and harga awal are provided
        if (field === 'margin' || field === 'hargaAwal') {
          const hargaAwal = parseCurrency(field === 'hargaAwal' ? value : newData[index].hargaAwal);
          const margin = parseFloat(field === 'margin' ? value : newData[index].margin) || 0;
          const hargaAkhir = hargaAwal + (hargaAwal * margin / 100);
          newData[index].hargaAkhir = hargaAkhir.toFixed(0);
        }
        setFormData(prev => ({ ...prev, alat: newData }));
        break;
      case 'Barang':
        newData = [...formData.barang];
        newData[index] = { ...newData[index], [field]: value };
        // Auto calculate harga satuan for Alat and Barang tabs
        if ((currentTab === 'Alat' || currentTab === 'Barang') && (field === 'harga' || field === 'jumlah')) {
          const harga = parseCurrency(field === 'harga' ? value : newData[index].harga);
          const jumlah = parseFloat(field === 'jumlah' ? value : newData[index].jumlah) || 0;
          if (jumlah > 0) {
            newData[index].hargaSatuan = (harga / jumlah).toFixed(0);
          } else {
            newData[index].hargaSatuan = '0';
          }
        }
        // Auto calculate harga akhir if margin and harga awal are provided
        if (field === 'margin' || field === 'hargaAwal') {
          const hargaAwal = parseCurrency(field === 'hargaAwal' ? value : newData[index].hargaAwal);
          const margin = parseFloat(field === 'margin' ? value : newData[index].margin) || 0;
          const hargaAkhir = hargaAwal + (hargaAwal * margin / 100);
          newData[index].hargaAkhir = hargaAkhir.toFixed(0);
        }
        setFormData(prev => ({ ...prev, barang: newData }));
        break;
      case 'MobDemob':
        newData = [...formData.mobDemob];
        newData[index] = { ...newData[index], [field]: value };
        // Auto calculate harga akhir if margin and harga awal are provided
        if (field === 'margin' || field === 'hargaAwal') {
          const hargaAwal = parseCurrency(field === 'hargaAwal' ? value : newData[index].hargaAwal);
          const margin = parseFloat(field === 'margin' ? value : newData[index].margin) || 0;
          const hargaAkhir = hargaAwal + (hargaAwal * margin / 100);
          newData[index].hargaAkhir = hargaAkhir.toFixed(0);
        }
        setFormData(prev => ({ ...prev, mobDemob: newData }));
        break;
      case 'Biaya Lain-lain':
        newData = [...formData.biayaLainLain];
        newData[index] = { ...newData[index], [field]: value };
        // Auto calculate harga akhir if margin and harga awal are provided
        if (field === 'margin' || field === 'hargaAwal') {
          const hargaAwal = parseCurrency(field === 'hargaAwal' ? value : newData[index].hargaAwal);
          const margin = parseFloat(field === 'margin' ? value : newData[index].margin) || 0;
          const hargaAkhir = hargaAwal + (hargaAwal * margin / 100);
          newData[index].hargaAkhir = hargaAkhir.toFixed(0);
        }
        setFormData(prev => ({ ...prev, biayaLainLain: newData }));
        break;
    }
  };

  const addTabData = () => {
    const currentTab = formData.activeTab;
    
    switch (currentTab) {
      case 'Tenaga Kerja':
        setFormData(prev => ({
          ...prev,
          tenagaKerja: [...prev.tenagaKerja, { tenaga: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
        }));
        break;
      case 'Jasa':
        setFormData(prev => ({
          ...prev,
          jasa: [...prev.jasa, { jasa: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
        }));
        break;
      case 'Alat':
        setFormData(prev => ({
          ...prev,
          alat: [...prev.alat, { alat: '', harga: '', jumlah: '', hari: '', satuan: '', hargaSatuan: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
        }));
        break;
      case 'Barang':
        setFormData(prev => ({
          ...prev,
          barang: [...prev.barang, { namaBarang: '', harga: '', jumlah: '', hari: '', satuan: '', hargaSatuan: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
        }));
        break;
      case 'MobDemob':
        setFormData(prev => ({
          ...prev,
          mobDemob: [...prev.mobDemob, { namaTransportasi: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
        }));
        break;
      case 'Biaya Lain-lain':
        setFormData(prev => ({
          ...prev,
          biayaLainLain: [...prev.biayaLainLain, { namaBiaya: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
        }));
        break;
    }
  };

  const removeTabData = (index: number) => {
    const currentTab = formData.activeTab;
    const currentData = getCurrentTabData();
    
    if (currentData.length > 1) {
      switch (currentTab) {
        case 'Tenaga Kerja':
          setFormData(prev => ({
            ...prev,
            tenagaKerja: prev.tenagaKerja.filter((_, i) => i !== index)
          }));
          break;
        case 'Jasa':
          setFormData(prev => ({
            ...prev,
            jasa: prev.jasa.filter((_, i) => i !== index)
          }));
          break;
        case 'Alat':
          setFormData(prev => ({
            ...prev,
            alat: prev.alat.filter((_, i) => i !== index)
          }));
          break;
        case 'Barang':
          setFormData(prev => ({
            ...prev,
            barang: prev.barang.filter((_, i) => i !== index)
          }));
          break;
        case 'MobDemob':
          setFormData(prev => ({
            ...prev,
            mobDemob: prev.mobDemob.filter((_, i) => i !== index)
          }));
          break;
        case 'Biaya Lain-lain':
          setFormData(prev => ({
            ...prev,
            biayaLainLain: prev.biayaLainLain.filter((_, i) => i !== index)
          }));
          break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Data is already updated in formData via handleTabDataChange
    onSave(formData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      noKontrak: '',
      durasiKontrak: '',
      namaClient: '',
      lokasiPekerjaan: '',
      namaProject: '',
      jenisPekerjaan: 'On Call',
      estimasiNilaiKontrak: '',
      activeTab: 'Tenaga Kerja',
      tenagaKerja: [
        { tenaga: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }
      ],
      jasa: [{ jasa: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
      alat: [{ alat: '', harga: '', jumlah: '', hari: '', satuan: '', hargaSatuan: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
      barang: [{ namaBarang: '', harga: '', jumlah: '', hari: '', satuan: '', hargaSatuan: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
      mobDemob: [{ namaTransportasi: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }],
      biayaLainLain: [{ namaBiaya: '', tunjangan: '', projectRate: '', hari: '', hargaAwal: '', margin: '', hargaAkhir: '' }]
    });
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { summaries, overallTotalHargaAwal, overallTotalHargaAkhir, sisaHPP, estimasiNilaiKontrakParsed } = useMemo(() => {
    const summaries: CategorySummary[] = [];
    let overallTotalHargaAwal = 0;
    let overallTotalHargaAkhir = 0;

    const processCategory = (name: string, items: any[]) => {
      let totalHargaAwal = 0;
      let totalHargaAkhir = 0;
      let totalMarginValue = 0;

      items.forEach(item => {
        const hargaAwal = parseCurrency(item.hargaAwal);
        const hargaAkhir = parseCurrency(item.hargaAkhir);
        const margin = parseFloat(item.margin) || 0;

        totalHargaAwal += hargaAwal;
        totalHargaAkhir += hargaAkhir;
        totalMarginValue += (hargaAwal * margin / 100);

        overallTotalHargaAwal += hargaAwal;
        overallTotalHargaAkhir += hargaAkhir;
      });

      summaries.push({
        category: name,
        totalHargaAwal,
        totalMarginValue,
        totalHargaAkhir,
      });
    };

    processCategory('Tenaga Kerja', formData.tenagaKerja);
    processCategory('Jasa', formData.jasa);
    processCategory('Alat', formData.alat);
    processCategory('Barang', formData.barang);
    processCategory('MobDemob', formData.mobDemob);
    processCategory('Biaya Lain-lain', formData.biayaLainLain);

    const estimasiNilaiKontrakParsed = parseCurrency(formData.estimasiNilaiKontrak);
    const sisaHPP = estimasiNilaiKontrakParsed - overallTotalHargaAkhir;

    return { summaries, overallTotalHargaAwal, overallTotalHargaAkhir, sisaHPP, estimasiNilaiKontrakParsed };
  }, [formData]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry HPP Induk</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* No Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Kontrak <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noKontrak}
                  onChange={(e) => handleInputChange('noKontrak', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih No Kontrak</option>
                  <option value="KTR-2025-001">KTR-2025-001</option>
                  <option value="KTR-2025-002">KTR-2025-002</option>
                  <option value="KTR-2025-003">KTR-2025-003</option>
                </select>
                {errors.noKontrak && (
                  <p className="mt-1 text-sm text-red-600">{errors.noKontrak}</p>
                )}
              </div>

              {/* Durasi Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi Kontrak
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={formData.durasiKontrak.split(' s.d ')[0] || ''}
                    onChange={(e) => {
                      const endDate = formData.durasiKontrak.split(' s.d ')[1] || '';
                      handleInputChange('durasiKontrak', `${e.target.value}${endDate ? ` s.d ${endDate}` : ''}`);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <span className="text-gray-500 text-sm">s.d</span>
                  <input
                    type="date"
                    value={formData.durasiKontrak.split(' s.d ')[1] || ''}
                    onChange={(e) => {
                      const startDate = formData.durasiKontrak.split(' s.d ')[0] || '';
                      handleInputChange('durasiKontrak', `${startDate} s.d ${e.target.value}`);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Nama Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) => handleInputChange('namaClient', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaClient ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nama Client</option>
                  {clientOptions.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
                {errors.namaClient && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaClient}</p>
                )}
              </div>

              {/* Lokasi Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lokasiPekerjaan}
                  onChange={(e) => handleInputChange('lokasiPekerjaan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.lokasiPekerjaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Jl. Perintis Kemerdekaan, Jakarta"
                />
                {errors.lokasiPekerjaan && (
                  <p className="mt-1 text-sm text-red-600">{errors.lokasiPekerjaan}</p>
                )}
              </div>

              {/* Nama Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaProject}
                  onChange={(e) => handleInputChange('namaProject', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaProject ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama project"
                />
                {errors.namaProject && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaProject}</p>
                )}
              </div>

              {/* Jenis Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pekerjaan
                </label>
                <select
                  value={formData.jenisPekerjaan}
                  onChange={(e) => handleInputChange('jenisPekerjaan', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {jenisPekerjaanOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
              </div>

              {/* Estimasi Nilai Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimasi Nilai Kontrak
                </label>
                <input
                  type="text"
                  value={formData.estimasiNilaiKontrak}
                  onChange={(e) => handleInputChange('estimasiNilaiKontrak', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 0"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleInputChange('activeTab', tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                      formData.activeTab === tab
                        ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - Supply Table */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{formData.activeTab}</h3>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                {/* Tenaga Kerja Table */}
                {formData.activeTab === 'Tenaga Kerja' && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tenaga</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Project Rate</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Awal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margin</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Akhir</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.tenagaKerja.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.tenaga}
                              onChange={(e) => handleTabDataChange(index, 'tenaga', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Nama Tenaga"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.tunjangan}
                              onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Tunjangan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.projectRate}
                              onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) => handleTabDataChange(index, 'hargaAwal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) => handleTabDataChange(index, 'margin', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseCurrency(item.hargaAkhir))}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.tenagaKerja.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Jasa Table */}
                {formData.activeTab === 'Jasa' && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jasa</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Project Rate</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Awal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margin</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Akhir</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.jasa.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.jasa}
                              onChange={(e) => handleTabDataChange(index, 'jasa', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Jasa Tenaga"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.tunjangan}
                              onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Tunjangan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.projectRate}
                              onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) => handleTabDataChange(index, 'hargaAwal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) => handleTabDataChange(index, 'margin', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaAkhir) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.jasa.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Alat Table */}
                {formData.activeTab === 'Alat' && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Alat</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jumlah</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Satuan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Satuan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Awal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margin</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Akhir</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.alat.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.alat}
                              onChange={(e) => handleTabDataChange(index, 'alat', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Nama Alat"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.harga}
                              onChange={(e) => handleTabDataChange(index, 'harga', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) => handleTabDataChange(index, 'jumlah', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.satuan}
                              onChange={(e) => handleTabDataChange(index, 'satuan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Satuan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaSatuan) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) => handleTabDataChange(index, 'hargaAwal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) => handleTabDataChange(index, 'margin', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaAkhir) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.alat.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Barang Table */}
                {formData.activeTab === 'Barang' && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Barang</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jumlah</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Satuan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Satuan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Awal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margin</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Akhir</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.barang.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.namaBarang}
                              onChange={(e) => handleTabDataChange(index, 'namaBarang', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Nama Barang"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.harga}
                              onChange={(e) => handleTabDataChange(index, 'harga', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.jumlah}
                              onChange={(e) => handleTabDataChange(index, 'jumlah', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Jumlah"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.satuan}
                              onChange={(e) => handleTabDataChange(index, 'satuan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Satuan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaSatuan) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Satuan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) => handleTabDataChange(index, 'hargaAwal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) => handleTabDataChange(index, 'margin', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaAkhir) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.barang.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* MobDemob Table */}
                {formData.activeTab === 'MobDemob' && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MobDemob</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Project Rate</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Awal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margin</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Akhir</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.mobDemob.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.namaTransportasi}
                              onChange={(e) => handleTabDataChange(index, 'namaTransportasi', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Nama Transportasi"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.tunjangan}
                              onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Tunjangan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.projectRate}
                              onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) => handleTabDataChange(index, 'hargaAwal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) => handleTabDataChange(index, 'margin', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaAkhir) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.mobDemob.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Biaya Lain-lain Table */}
                {formData.activeTab === 'Biaya Lain-lain' && (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Biaya</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Project Rate</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Awal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margin</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Harga Akhir</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.biayaLainLain.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.namaBiaya}
                              onChange={(e) => handleTabDataChange(index, 'namaBiaya', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Nama Biaya"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.tunjangan}
                              onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Tunjangan"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.projectRate}
                              onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Project Rate"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hari}
                              onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Hari"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.hargaAwal}
                              onChange={(e) => handleTabDataChange(index, 'hargaAwal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Harga Awal"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={(e) => handleTabDataChange(index, 'margin', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              placeholder="Margin %"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={formatCurrency(parseFloat(item.hargaAkhir) || 0)}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                              placeholder="Harga Akhir"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeTabData(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.biayaLainLain.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Sisa HPP Table */}
                {formData.activeTab === 'Sisa HPP' && (
                  <div className="p-4">
                    <table className="w-full mb-6">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kategori</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Harga Awal</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Margin</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Harga Akhir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {summaries.map((summary, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{summary.category}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(summary.totalHargaAwal)}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(summary.totalMarginValue)}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(summary.totalHargaAkhir)}</td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold">
                          <td className="px-4 py-3 text-sm text-blue-800">Total Keseluruhan</td>
                          <td className="px-4 py-3 text-sm text-blue-800">{formatCurrency(overallTotalHargaAwal)}</td>
                          <td className="px-4 py-3 text-sm text-blue-800">{formatCurrency(summaries.reduce((acc, curr) => acc + curr.totalMarginValue, 0))}</td>
                          <td className="px-4 py-3 text-sm text-blue-800">{formatCurrency(overallTotalHargaAkhir)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimasi Nilai Kontrak:</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(estimasiNilaiKontrakParsed)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total HPP:</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(overallTotalHargaAkhir)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700">Sisa HPP:</p>
                        <p className={`text-2xl font-extrabold ${sisaHPP >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(sisaHPP)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {formData.activeTab !== 'Sisa HPP' && (
              <button
                type="button"
                onClick={addTabData}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Baris</span>
              </button>
            )}
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
                <span>Simpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HPPIndukModal;
