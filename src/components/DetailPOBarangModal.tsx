import React from 'react';
import Modal from './Modal';
import { DetailPOBarangData, DetailPOBarangItem } from '../types';

interface DetailPOBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  poId: number | null;
}

// Mock data for demonstration
const mockDetailPOData: { [key: number]: DetailPOBarangData } = {
  1: {
    noPr: 'PR001',
    vendor: 'PT Jaya Jaya',
    ppn: '11%',
    noPoBarang: 'PO-001',
    tanggalPo: '28/08/2025',
    items: [
      { kodeBarang: 'BRG-001', namaBarang: 'Kabel Listrik NYY 3x2.5mm', beliSatuan: 'Roll', jumlahBeli: 10, hargaSatuan: 500000, disc: 5, jumlah: 4750000 },
      { kodeBarang: 'BRG-002', namaBarang: 'Pipa PVC 3 Inch', beliSatuan: 'Batang', jumlahBeli: 15, hargaSatuan: 120000, disc: 10, jumlah: 1620000 },
      { kodeBarang: 'BRG-003', namaBarang: 'Saklar Listrik Schneider', beliSatuan: 'Unit', jumlahBeli: 20, hargaSatuan: 45000, disc: 0, jumlah: 900000 },
      { kodeBarang: 'BRG-004', namaBarang: 'Panel Listrik MCB 4 Line', beliSatuan: 'Unit', jumlahBeli: 5, hargaSatuan: 800000, disc: 5, jumlah: 3800000 },
      { kodeBarang: 'BRG-005', namaBarang: 'Stop Kontak Broco', beliSatuan: 'Unit', jumlahBeli: 50, hargaSatuan: 35000, disc: 2, jumlah: 1715000 },
    ],
  },
  2: {
    noPr: 'PR002',
    vendor: 'CV. Maju Jaya',
    ppn: '10%',
    noPoBarang: 'PO-002',
    tanggalPo: '10/02/2025',
    items: [
      { kodeBarang: 'BRG-006', namaBarang: 'Monitor LED 24 Inch', beliSatuan: 'Unit', jumlahBeli: 5, hargaSatuan: 2000000, disc: 0, jumlah: 10000000 },
      { kodeBarang: 'BRG-007', namaBarang: 'Keyboard Wireless', beliSatuan: 'Pcs', jumlahBeli: 10, hargaSatuan: 300000, disc: 5, jumlah: 2850000 },
    ],
  },
  // Add more mock data for other PO IDs if needed
};

const DetailPOBarangModal: React.FC<DetailPOBarangModalProps> = ({ isOpen, onClose, poId }) => {
  if (!isOpen || poId === null) return null;

  // In a real application, you would fetch detail data based on poId
  const detailData = mockDetailPOData[poId];

  if (!detailData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detail PO Barang" size="5xl">
        <p className="text-textSecondary">No details found for this PO.</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail PO Barang" size="5xl">
      <div className="p-4">
        {/* General Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">No PR</label>
            <p className="text-text font-semibold">{detailData.noPr}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Vendor</label>
            <p className="text-text font-semibold">{detailData.vendor}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">PPN</label>
            <p className="text-text font-semibold">{detailData.ppn}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">No PO Barang</label>
            <p className="text-text font-semibold">{detailData.noPoBarang}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Tanggal PO</label>
            <p className="text-text font-semibold">{detailData.tanggalPo}</p>
          </div>
        </div>

        {/* Items Table Section */}
        <h4 className="text-lg font-semibold text-text mb-4">Item Details</h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Kode Barang
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Beli Satuan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Jumlah Beli (pcs)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Harga Satuan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Disc (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {detailData.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeBarang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.beliSatuan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlahBeli}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.hargaSatuan)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.disc}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.jumlah)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailPOBarangModal;
