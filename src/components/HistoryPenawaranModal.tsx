import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryPenawaranModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryPenawaranData {
  id: string;
  kategoriPajak: string;
  namaCustomer: string;
  tanggalPenawaran: string;
  statusDok: string;
  namaDivisi: string;
  jasaPenawaran: string;
  kodeBarang: string;
  statusSO: string;
  jenisPekerjaan: string;
}

const HistoryPenawaranModal: React.FC<HistoryPenawaranModalProps> = ({ isOpen, onClose }) => {
  // Sample data matching the image
  const historyData: HistoryPenawaranData[] = [
    {
      id: '1',
      kategoriPajak: 'PPN',
      namaCustomer: 'PT. ABC',
      tanggalPenawaran: '2024-07-05',
      statusDok: 'Approved',
      namaDivisi: 'Produksi',
      jasaPenawaran: 'Jasa Las SMAW',
      kodeBarang: 'ELK-001',
      statusSO: 'Open',
      jenisPekerjaan: 'Proyek Konstruksi'
    },
    {
      id: '2',
      kategoriPajak: 'PPN',
      namaCustomer: 'PT. ABC',
      tanggalPenawaran: '2024-07-10',
      statusDok: 'Approved',
      namaDivisi: 'Inspeksi',
      jasaPenawaran: 'Jasa NDT (MPT)',
      kodeBarang: 'NDT-002',
      statusSO: 'Open',
      jenisPekerjaan: 'Perawatan Mesin'
    },
    {
      id: '3',
      kategoriPajak: 'PPN',
      namaCustomer: 'PT. ABC',
      tanggalPenawaran: '2024-07-15',
      statusDok: 'Approved',
      namaDivisi: 'Konsultasi',
      jasaPenawaran: 'Jasa Konsultasi Teknik',
      kodeBarang: 'KNS-003',
      statusSO: 'Open',
      jenisPekerjaan: 'Perancangan Struktur'
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">History Penawaran</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Kategori Pajak
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Nama Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Tanggal Penawaran
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Status Dok
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Nama Divisi
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Jasa Penawaran
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Kode Barang
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Status SO
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Jenis Pekerjaan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-50 transition-colors duration-200`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.kategoriPajak}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.namaCustomer}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.tanggalPenawaran}
                      </td>
                      <td className="px-4 py-3 text-sm border border-gray-200">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.statusDok}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.namaDivisi}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.jasaPenawaran}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.kodeBarang}
                      </td>
                      <td className="px-4 py-3 text-sm border border-gray-200">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.statusSO}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.jenisPekerjaan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">1 of 1</span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
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

export default HistoryPenawaranModal;
