import React from 'react';
import Modal from './Modal';
import { DetailedBiddingEntry } from '../types';

interface DetailSeleksiModalProps {
  isOpen: boolean;
  onClose: () => void;
  biddingDetail: DetailedBiddingEntry | null;
}

const DetailSeleksiModal: React.FC<DetailSeleksiModalProps> = ({ isOpen, onClose, biddingDetail }) => {
  if (!biddingDetail) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Seleksi" size="5xl">
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <label className="block text-textSecondary mb-1">Tanggal Bidding</label>
          <p className="font-medium text-text">{biddingDetail.tanggalBidding}</p>
        </div>
        <div>
          <label className="block text-textSecondary mb-1">No PR</label>
          <p className="font-medium text-text">{biddingDetail.noPr}</p>
        </div>
        <div className="col-span-2">
          <label className="block text-textSecondary mb-1">Departemen</label>
          <p className="font-medium text-text">{biddingDetail.departemen}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Group by vendor for better readability, similar to the image */}
        {Array.from(new Set(biddingDetail.vendorOfferings.map(o => o.namaVendor))).map((vendorName, vendorIndex) => (
          <div key={vendorIndex} className="border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-surface p-3 text-text font-semibold border-b border-border">
              Vendor: {vendorName}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-textSecondary">
                <thead className="bg-gray-700/10 text-text uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-2">Nama Barang</th>
                    <th scope="col" className="px-4 py-2">Qty</th>
                    <th scope="col" className="px-4 py-2">Harga</th>
                    <th scope="col" className="px-4 py-2">Diskon</th>
                    <th scope="col" className="px-4 py-2">Jumlah</th>
                    <th scope="col" className="px-4 py-2">PPN / Non PPN</th>
                    <th scope="col" className="px-4 py-2">Lama Pengiriman</th>
                    <th scope="col" className="px-4 py-2">Garansi</th>
                    <th scope="col" className="px-4 py-2">Metode Bayar</th>
                    <th scope="col" className="px-4 py-2">Keterangan</th>
                    <th scope="col" className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {biddingDetail.vendorOfferings
                    .filter(o => o.namaVendor === vendorName)
                    .map((offering, itemIndex) => (
                      <tr key={itemIndex} className="hover:bg-gray-700/5">
                        <td className="px-4 py-2 font-medium text-text">{offering.namaBarang}</td>
                        <td className="px-4 py-2">{offering.qty}</td>
                        <td className="px-4 py-2">{offering.harga}</td>
                        <td className="px-4 py-2">{offering.diskon}</td>
                        <td className="px-4 py-2">{offering.jumlah}</td>
                        <td className="px-4 py-2">{offering.ppnNonPpn}</td>
                        <td className="px-4 py-2">{offering.lamaPengiriman}</td>
                        <td className="px-4 py-2">{offering.garansi}</td>
                        <td className="px-4 py-2">{offering.metodeBayar}</td>
                        <td className="px-4 py-2">{offering.keterangan}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              offering.status === 'Approve'
                                ? 'bg-success/20 text-success'
                                : offering.status === 'Rejected'
                                ? 'bg-error/20 text-error'
                                : 'bg-warning/20 text-warning'
                            }`}
                          >
                            {offering.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t border-border">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-textSecondary/20 text-text rounded-md hover:bg-textSecondary/30 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default DetailSeleksiModal;
