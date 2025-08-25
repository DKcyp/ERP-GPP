import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface HPPIndukDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  hppData: HPPIndukDetailData | null;
}

export interface HPPIndukDetailData {
  id: string;
  namaClient: string;
  namaProject: string;
  lokasi: string;
  estimasiHPP: string;
  statusDokumen: string;
  tanggalUpdate: string;
}

interface TenagaKerjaItem {
  tenaga: string;
  gajiPokok: string;
  projectRate: string;
  hari: string;
  hpp: string;
  margin: string;
  hargaPenawaran: string;
}

interface MobDemobItem {
  namaTransportasi: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
}

interface BiayaLainLainItem {
  nama: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
}

interface SisaHPPItem {
  tenaga: string;
  gajiPokok: string;
  projectRate: string;
  hari: string;
  hpp: string;
  margin: string;
  hargaPenawaran: string;
  sisaHPP: string;
}

const HPPIndukDetailModal: React.FC<HPPIndukDetailModalProps> = ({ isOpen, onClose, hppData }) => {
  const [activeTab, setActiveTab] = useState('Tenaga Kerja');

  const tabs = ['Tenaga Kerja', 'Jasa', 'Alat', 'Barang', 'MobDemob', 'Biaya Lain-lain', 'Sisa HPP'];

  // Sample data for Tenaga Kerja tab
  const tenagaKerjaData: TenagaKerjaItem[] = [
    {
      tenaga: 'Supervisor',
      gajiPokok: 'Rp 10.000.000',
      projectRate: 'Rp 500.000',
      hari: '30',
      hpp: 'Rp 15.000.000',
      margin: '20%',
      hargaPenawaran: 'Rp 18.000.000'
    },
    {
      tenaga: 'Engineer',
      gajiPokok: 'Rp 8.000.000',
      projectRate: 'Rp 400.000',
      hari: '30',
      hpp: 'Rp 12.000.000',
      margin: '18%',
      hargaPenawaran: 'Rp 14.160.000'
    },
    {
      tenaga: 'Teknisi',
      gajiPokok: 'Rp 5.000.000',
      projectRate: 'Rp 250.000',
      hari: '30',
      hpp: 'Rp 7.500.000',
      margin: '15%',
      hargaPenawaran: 'Rp 8.625.000'
    },
    {
      tenaga: 'Helper',
      gajiPokok: 'Rp 3.000.000',
      projectRate: 'Rp 150.000',
      hari: '30',
      hpp: 'Rp 4.500.000',
      margin: '10%',
      hargaPenawaran: 'Rp 4.950.000'
    }
  ];

  // Sample data for MobDemob tab
  const [mobDemobData, setMobDemobData] = useState<MobDemobItem[]>([
    {
      namaTransportasi: '',
      tunjangan: '',
      projectRate: '',
      hari: '',
      hargaAwal: '',
      margin: '',
      hargaAkhir: ''
    }
  ]);

  // Sample data for Biaya Lain-lain tab
  const [biayaLainLainData, setBiayaLainLainData] = useState<BiayaLainLainItem[]>([
    {
      nama: '',
      tunjangan: '',
      projectRate: '',
      hari: '',
      hargaAwal: '',
      margin: '',
      hargaAkhir: ''
    }
  ]);

  // Sample data for Sisa HPP tab
  const sisaHPPData: SisaHPPItem[] = [
    {
      tenaga: 'Inspektur NDT Level II (UT)',
      gajiPokok: 'Rp 15.000.000',
      projectRate: 'Rp 500.000/hari',
      hari: '20',
      hpp: 'Rp 10.000.000',
      margin: '15%',
      hargaPenawaran: 'Rp 11.500.000',
      sisaHPP: 'Rp 1.500.000'
    },
    {
      tenaga: 'Welder Certified (SMAW, GTAW)',
      gajiPokok: 'Rp 13.500.000',
      projectRate: 'Rp 450.000/hari',
      hari: '25',
      hpp: 'Rp 11.250.000',
      margin: '10%',
      hargaPenawaran: 'Rp 12.375.000',
      sisaHPP: 'Rp 2.500.000'
    },
    {
      tenaga: 'Quality Control Engineer',
      gajiPokok: 'Rp 18.000.000',
      projectRate: 'Rp 600.000/hari',
      hari: '15',
      hpp: 'Rp 9.000.000',
      margin: '20%',
      hargaPenawaran: 'Rp 10.800.000',
      sisaHPP: 'Rp 1.800.000'
    },
    {
      tenaga: 'Site Manager',
      gajiPokok: 'Rp 21.000.000',
      projectRate: 'Rp 700.000/hari',
      hari: '18',
      hpp: 'Rp 12.600.000',
      margin: '18%',
      hargaPenawaran: 'Rp 14.868.000',
      sisaHPP: 'Rp 2.268.000'
    },
    {
      tenaga: 'Helper',
      gajiPokok: 'Rp 9.000.000',
      projectRate: 'Rp 300.000/hari',
      hari: '30',
      hpp: 'Rp 9.000.000',
      margin: '5%',
      hargaPenawaran: 'Rp 9.450.000',
      sisaHPP: 'Rp 450.000'
    }
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

  const handleMobDemobChange = (index: number, field: keyof MobDemobItem, value: string) => {
    const newData = [...mobDemobData];
    newData[index] = { ...newData[index], [field]: value };
    setMobDemobData(newData);
  };

  const handleBiayaLainLainChange = (index: number, field: keyof BiayaLainLainItem, value: string) => {
    const newData = [...biayaLainLainData];
    newData[index] = { ...newData[index], [field]: value };
    setBiayaLainLainData(newData);
  };

  const addMobDemobRow = () => {
    setMobDemobData(prev => [...prev, {
      namaTransportasi: '',
      tunjangan: '',
      projectRate: '',
      hari: '',
      hargaAwal: '',
      margin: '',
      hargaAkhir: ''
    }]);
  };

  const addBiayaLainLainRow = () => {
    setBiayaLainLainData(prev => [...prev, {
      nama: '',
      tunjangan: '',
      projectRate: '',
      hari: '',
      hargaAwal: '',
      margin: '',
      hargaAkhir: ''
    }]);
  };

  const removeMobDemobRow = (index: number) => {
    if (mobDemobData.length > 1) {
      setMobDemobData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeBiayaLainLainRow = (index: number) => {
    if (biayaLainLainData.length > 1) {
      setBiayaLainLainData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderTableContent = () => {
    switch (activeTab) {
      case 'Tenaga Kerja':
        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Tenaga
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Gaji Pokok
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Project Rate
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Hari
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  HPP
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Margin
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Harga Penawaran
                </th>
              </tr>
            </thead>
            <tbody>
              {tenagaKerjaData.map((item, index) => (
                <tr 
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-medium">
                    {item.tenaga}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                    {item.gajiPokok}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                    {item.projectRate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 text-center">
                    {item.hari}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-medium">
                    {item.hpp}
                  </td>
                  <td className="px-4 py-3 text-sm border border-gray-200 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.margin}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-semibold text-blue-600">
                    {item.hargaPenawaran}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'MobDemob':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={addMobDemobRow}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    MobDemob
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Tunjangan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Project Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Hari
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Harga Awal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Margin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Harga Akhir
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {mobDemobData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.namaTransportasi}
                        onChange={(e) => handleMobDemobChange(index, 'namaTransportasi', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nama Transportasi"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.tunjangan}
                        onChange={(e) => handleMobDemobChange(index, 'tunjangan', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tunjangan"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.projectRate}
                        onChange={(e) => handleMobDemobChange(index, 'projectRate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Project Rate"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hari}
                        onChange={(e) => handleMobDemobChange(index, 'hari', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hari"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hargaAwal}
                        onChange={(e) => handleMobDemobChange(index, 'hargaAwal', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Harga Awal"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.margin}
                        onChange={(e) => handleMobDemobChange(index, 'margin', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Margin"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hargaAkhir}
                        onChange={(e) => handleMobDemobChange(index, 'hargaAkhir', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Harga Akhir"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <button
                        onClick={() => removeMobDemobRow(index)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mobDemobData.length === 1}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Biaya Lain-lain':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={addBiayaLainLainRow}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Tunjangan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Project Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Hari
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Harga Awal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Margin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Harga Akhir
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {biayaLainLainData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.nama}
                        onChange={(e) => handleBiayaLainLainChange(index, 'nama', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nama"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.tunjangan}
                        onChange={(e) => handleBiayaLainLainChange(index, 'tunjangan', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tunjangan"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.projectRate}
                        onChange={(e) => handleBiayaLainLainChange(index, 'projectRate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Project Rate"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hari}
                        onChange={(e) => handleBiayaLainLainChange(index, 'hari', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hari"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hargaAwal}
                        onChange={(e) => handleBiayaLainLainChange(index, 'hargaAwal', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Harga Awal"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.margin}
                        onChange={(e) => handleBiayaLainLainChange(index, 'margin', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Margin"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hargaAkhir}
                        onChange={(e) => handleBiayaLainLainChange(index, 'hargaAkhir', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Harga Akhir"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <button
                        onClick={() => removeMobDemobRow(index)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mobDemobData.length === 1}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Biaya Lain-lain':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={addBiayaLainLainRow}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Tunjangan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Project Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Hari
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Harga Awal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Margin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Harga Akhir
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {biayaLainLainData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.nama}
                        onChange={(e) => handleBiayaLainLainChange(index, 'nama', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nama"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.tunjangan}
                        onChange={(e) => handleBiayaLainLainChange(index, 'tunjangan', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tunjangan"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.projectRate}
                        onChange={(e) => handleBiayaLainLainChange(index, 'projectRate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Project Rate"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hari}
                        onChange={(e) => handleBiayaLainLainChange(index, 'hari', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hari"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hargaAwal}
                        onChange={(e) => handleBiayaLainLainChange(index, 'hargaAwal', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Harga Awal"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.margin}
                        onChange={(e) => handleBiayaLainLainChange(index, 'margin', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Margin"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.hargaAkhir}
                        onChange={(e) => handleBiayaLainLainChange(index, 'hargaAkhir', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Harga Akhir"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <button
                        onClick={() => removeBiayaLainLainRow(index)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={biayaLainLainData.length === 1}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Sisa HPP':
        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Tenaga
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Gaji Pokok
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Project Rate
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Hari
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  HPP
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Margin
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Harga Penawaran
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Sisa HPP
                </th>
              </tr>
            </thead>
            <tbody>
              {sisaHPPData.map((item, index) => (
                <tr 
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-medium">
                    {item.tenaga}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                    {item.gajiPokok}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                    {item.projectRate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 text-center">
                    {item.hari}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-medium">
                    {item.hpp}
                  </td>
                  <td className="px-4 py-3 text-sm border border-gray-200 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.margin}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-semibold text-blue-600">
                    {item.hargaPenawaran}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-semibold text-red-600">
                    {item.sisaHPP}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-8 text-center text-gray-500 border border-gray-200">
                  Data untuk {activeTab} belum tersedia
                </td>
              </tr>
            </tbody>
          </table>
        );
    }
  };

  if (!isOpen || !hppData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail Sisa HPP</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-6">
            {/* Project Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Client: </span>
                  <span className="text-gray-900">{hppData.namaClient}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Project: </span>
                  <span className="text-gray-900">{hppData.namaProject}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Lokasi: </span>
                  <span className="text-gray-900">{hppData.lokasi}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="overflow-x-auto">
              {renderTableContent()}
            </div>

            {/* Summary */}
            {activeTab === 'Tenaga Kerja' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total HPP Tenaga Kerja:</span>
                  <span className="text-xl font-bold text-blue-600">Rp 46.235.000</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HPPIndukDetailModal;
