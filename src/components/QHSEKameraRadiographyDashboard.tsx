import React, { useMemo, useState } from 'react';
import { Camera, Search, PlusCircle, Download, FileText, Pencil, Trash2, AlertTriangle, ExternalLink, Shield, Users, Calendar, Bell, Upload, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface KameraItem {
  id: string;
  noKamera: string;
  namaKamera: string;
  posisiKamera: 'Project' | 'Office';
  serialNumberIsotop: string;
  status: 'Aktif' | 'Maintenance' | 'Nonaktif';
}

interface IsotopItem {
  id: string;
  kameraId: string;
  nama: string;
  tipe: string;
  nomorSeri: string;
  tanggalMulaiAktivitas: string;
  izinPemanfaatan: string;
  masaBerlaku: string;
  supplier: string;
  nomorBAST: string;
  lokasiIjin: string;
  documentCertificate?: string;
  statusIsotop: 'Pemesanan Baru' | 'Pelimbahan Lama' | 'Penghentian Ijin' | 'Permohonan Baru' | 'Selesai';
}

interface PersonilItem {
  id: string;
  nama: string;
  noSIB: string;
  expSIB: string;
  masaBerlakuKontrak: string;
  kualifikasi: 'OR' | 'AR' | 'PPR' | 'AR+PPR';
  curiAwal: number;
  curiW1: number;
  curiW2: number;
  curiW3: number;
  curiW4: number;
  remainingCuri: number;
}

interface TLDItem {
  id: string;
  noTLD: string;
  personilId: string;
  namaPersonil: string;
  periodeTahun: number;
  periodeBulan: string;
  nilaiDosis: number;
  totalDosisPerTahun: number;
}

interface SurveyMeterItem {
  id: string;
  noSurveymeter: string;
  namaAlat: string;
  expCert: string;
  status: 'Valid' | 'Expired' | 'Warning';
}

interface UjiUsapItem {
  id: string;
  noMonitoring: string;
  kameraId: string;
  isotopId: string;
  kondisi: 'Baik' | 'Rusak' | 'Perlu Perbaikan';
  tanggalSertifikat: string;
  masaBerlakuSertifikat: string;
}

const QHSEKameraRadiographyDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'kamera' | 'isotop' | 'personil' | 'tld' | 'surveymeter' | 'ujiusap' | 'proses'>('kamera');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  // Sample data
  const [kameraData, setKameraData] = useState<KameraItem[]>([
    {
      id: '1',
      noKamera: 'KAM-001',
      namaKamera: 'Kamera Radiografi A',
      posisiKamera: 'Project',
      serialNumberIsotop: 'ISO-2024-001',
      status: 'Aktif'
    }
  ]);

  const [isotopData, setIsotopData] = useState<IsotopItem[]>([
    {
      id: '1',
      kameraId: '1',
      nama: 'Iridium-192',
      tipe: 'Gamma Source',
      nomorSeri: 'ISO-2024-001',
      tanggalMulaiAktivitas: '2024-01-15',
      izinPemanfaatan: 'IZN-2024-001',
      masaBerlaku: '2024-12-31',
      supplier: 'PT Isotop Indonesia',
      nomorBAST: 'BAST-2024-001',
      lokasiIjin: 'Area 1',
      statusIsotop: 'Selesai'
    }
  ]);

  const [personilData, setPersonilData] = useState<PersonilItem[]>([
    {
      id: '1',
      nama: 'John Doe',
      noSIB: 'SIB-2024-001',
      expSIB: '2024-12-31',
      masaBerlakuKontrak: '2024-12-31',
      kualifikasi: 'AR+PPR',
      curiAwal: 100,
      curiW1: 25,
      curiW2: 25,
      curiW3: 25,
      curiW4: 25,
      remainingCuri: 30
    }
  ]);

  const [tldData, setTLDData] = useState<TLDItem[]>([
    {
      id: '1',
      noTLD: 'TLD-2024-001',
      personilId: '1',
      namaPersonil: 'John Doe',
      periodeTahun: 2024,
      periodeBulan: 'Q1',
      nilaiDosis: 2.5,
      totalDosisPerTahun: 10.0
    }
  ]);

  const [surveyMeterData, setSurveyMeterData] = useState<SurveyMeterItem[]>([
    {
      id: '1',
      noSurveymeter: 'SM-001',
      namaAlat: 'Survey Meter Digital',
      expCert: '2024-12-31',
      status: 'Valid'
    }
  ]);

  const [ujiUsapData, setUjiUsapData] = useState<UjiUsapItem[]>([
    {
      id: '1',
      noMonitoring: 'UU-2024-001',
      kameraId: '1',
      isotopId: '1',
      kondisi: 'Baik',
      tanggalSertifikat: '2024-06-01',
      masaBerlakuSertifikat: '2024-12-01'
    }
  ]);

  // Statistics
  const stats = useMemo(() => {
    const totalKamera = kameraData.length;
    const kameraAktif = kameraData.filter(k => k.status === 'Aktif').length;
    const isotopAktif = isotopData.filter(i => i.statusIsotop === 'Selesai').length;
    const personilLowCuri = personilData.filter(p => p.remainingCuri <= 35).length;
    const tldOverdue = tldData.filter(t => t.nilaiDosis > 20).length;
    const surveyMeterExpired = surveyMeterData.filter(s => s.status === 'Expired').length;

    return {
      totalKamera,
      kameraAktif,
      isotopAktif,
      personilLowCuri,
      tldOverdue,
      surveyMeterExpired
    };
  }, [kameraData, isotopData, personilData, tldData, surveyMeterData]);

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case 'kamera':
        return kameraData.filter(item => 
          item.noKamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.namaKamera.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'isotop':
        return isotopData.filter(item => 
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nomorSeri.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'personil':
        return personilData.filter(item => 
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.noSIB.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'tld':
        return tldData.filter(item => 
          item.noTLD.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'surveymeter':
        return surveyMeterData.filter(item => 
          item.noSurveymeter.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'ujiusap':
        return ujiUsapData.filter(item => 
          item.noMonitoring.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  }, [activeTab, searchTerm, kameraData, isotopData, personilData, tldData, surveyMeterData, ujiUsapData]);

  const getStatusBadge = (status: string, type: 'kamera' | 'isotop' | 'personil' | 'surveymeter' | 'ujiusap') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (type) {
      case 'kamera':
        switch (status) {
          case 'Aktif': return `${baseClasses} bg-green-100 text-green-800`;
          case 'Maintenance': return `${baseClasses} bg-yellow-100 text-yellow-800`;
          case 'Nonaktif': return `${baseClasses} bg-red-100 text-red-800`;
          default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
      case 'isotop':
        switch (status) {
          case 'Selesai': return `${baseClasses} bg-green-100 text-green-800`;
          case 'Pemesanan Baru': return `${baseClasses} bg-blue-100 text-blue-800`;
          case 'Pelimbahan Lama': return `${baseClasses} bg-yellow-100 text-yellow-800`;
          case 'Penghentian Ijin': return `${baseClasses} bg-red-100 text-red-800`;
          case 'Permohonan Baru': return `${baseClasses} bg-purple-100 text-purple-800`;
          default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
      case 'surveymeter':
        switch (status) {
          case 'Valid': return `${baseClasses} bg-green-100 text-green-800`;
          case 'Warning': return `${baseClasses} bg-yellow-100 text-yellow-800`;
          case 'Expired': return `${baseClasses} bg-red-100 text-red-800`;
          default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
      case 'ujiusap':
        switch (status) {
          case 'Baik': return `${baseClasses} bg-green-100 text-green-800`;
          case 'Perlu Perbaikan': return `${baseClasses} bg-yellow-100 text-yellow-800`;
          case 'Rusak': return `${baseClasses} bg-red-100 text-red-800`;
          default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Kamera Radiography</h1>
        </div>
        <p className="text-gray-600">Monitoring & manajemen kamera radiografi, isotop, personil, dan sertifikasi</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kamera</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalKamera}</p>
            </div>
            <Camera className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kamera Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{stats.kameraAktif}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Isotop Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{stats.isotopAktif}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Curi Alert</p>
              <p className="text-2xl font-bold text-gray-900">{stats.personilLowCuri}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">TLD Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tldOverdue}</p>
            </div>
            <Bell className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Survey Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.surveyMeterExpired}</p>
            </div>
            <XCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor kamera, nama kamera..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Data
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {[
              { key: 'kamera', label: 'Data Kamera', icon: Camera },
              { key: 'isotop', label: 'Inventarisasi Isotop', icon: Shield },
              { key: 'personil', label: 'Kualifikasi Personil', icon: Users },
              { key: 'tld', label: 'TLD (Kartu Dosis)', icon: FileText },
              { key: 'surveymeter', label: 'Surveymeter', icon: Search },
              { key: 'ujiusap', label: 'Uji Usap Kamera', icon: Eye },
              { key: 'proses', label: 'Proses Isotop', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="p-4">
          {activeTab === 'kamera' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Kamera</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kamera</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN Isotop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.noKamera}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaKamera}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.posisiKamera}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.serialNumberIsotop}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(item.status, 'kamera')}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Other tab contents will be implemented similarly */}
          {activeTab !== 'kamera' && (
            <div className="text-center py-8 text-gray-500">
              <p>Content for {activeTab} tab will be implemented here</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <ConfirmDeleteModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => {
            // Handle delete logic here
            setDeleteItem(null);
          }}
          title="Hapus Data"
          message={`Apakah Anda yakin ingin menghapus data ini?`}
        />
      )}
    </div>
  );
};

export default QHSEKameraRadiographyDashboard;
