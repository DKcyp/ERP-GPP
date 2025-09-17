import React, { useState } from 'react';

interface PenerimaanBarangItem {
  id: number;
  noPr: string;
  tanggalPr: string; // dd-mm-yyyy
  noPo: string;
  tanggalPo: string; // dd-mm-yyyy
  tanggalDiterima: string; // dd-mm-yyyy
  namaSupplier: string;
  status: 'Diterima' | 'Sebagian' | 'Belum Diterima';
}

const initialData: PenerimaanBarangItem[] = [
  {
    id: 1,
    noPr: 'PR001',
    tanggalPr: '28-12-2024',
    noPo: 'PO001',
    tanggalPo: '01-01-2025',
    tanggalDiterima: '05-01-2025',
    namaSupplier: 'PT. Global Intermedia',
    status: 'Diterima',
  },
  {
    id: 2,
    noPr: 'PR002',
    tanggalPr: '05-02-2025',
    noPo: 'PO002',
    tanggalPo: '10-02-2025',
    tanggalDiterima: '—',
    namaSupplier: 'CV. Maju Jaya',
    status: 'Belum Diterima',
  },
  {
    id: 3,
    noPr: 'PR003',
    tanggalPr: '11-03-2025',
    noPo: 'PO003',
    tanggalPo: '15-03-2025',
    tanggalDiterima: '18-03-2025',
    namaSupplier: 'UD. Cahaya Abadi',
    status: 'Sebagian',
  },
];

const badgeClass = (status: PenerimaanBarangItem['status']) =>
  status === 'Diterima'
    ? 'bg-green-100 text-green-800'
    : status === 'Sebagian'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-red-100 text-red-800';

const PenerimaanBarangDashboard: React.FC = () => {
  const [rows] = useState<PenerimaanBarangItem[]>(initialData);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">PENERIMAAN BARANG</h1>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">No PR</th>
                  <th className="px-6 py-3">Tanggal PR</th>
                  <th className="px-6 py-3">No PO</th>
                  <th className="px-6 py-3">Tanggal PO</th>
                  <th className="px-6 py-3">Tanggal Barang Diterima</th>
                  <th className="px-6 py-3">Nama Supplier</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.noPr}</td>
                    <td className="px-6 py-4">{item.tanggalPr}</td>
                    <td className="px-6 py-4">{item.noPo}</td>
                    <td className="px-6 py-4">{item.tanggalPo}</td>
                    <td className="px-6 py-4">{item.tanggalDiterima}</td>
                    <td className="px-6 py-4">{item.namaSupplier}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <span>Showing 1 to {rows.length} of {rows.length} entries</span>
            <div className="flex">
              <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
              <button className="px-3 py-1 border bg-cyan-500 text-white">1</button>
              <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenerimaanBarangDashboard;
