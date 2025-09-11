import React, { useState } from 'react';
import { Clock } from 'lucide-react';

type Status = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';

interface ReimburseRow {
  id: number;
  noReimburse: string;
  tglReimburse: string; // yyyy-mm-dd
  namaDivisi: string;
  noSO: string;
  nominalReimburse: number;
  statusDokumen: Status;
  namaKaryawan: string;
  namaAkun: string;
  approver1?: string;
  approver2?: string;
  approver3?: string;
  approver4?: string;
  approver5?: string;
  keterangan: string;
}

const ReimburseVoucherDashboard: React.FC = () => {
  const [rows] = useState<ReimburseRow[]>([
    {
      id: 1,
      noReimburse: 'RMB-2025-0901',
      tglReimburse: '2025-09-02',
      namaDivisi: 'Finance',
      noSO: 'SO-001',
      nominalReimburse: 1500000,
      statusDokumen: 'Submitted',
      namaKaryawan: 'Budi Santoso',
      namaAkun: 'Biaya Operasional',
      approver1: 'Manajer Finance',
      approver2: 'Direktur Operasional',
      keterangan: 'Perjalanan dinas Jakarta',
    },
    {
      id: 2,
      noReimburse: 'RMB-2025-0902',
      tglReimburse: '2025-09-05',
      namaDivisi: 'Accounting',
      noSO: 'SO-015',
      nominalReimburse: 800000,
      statusDokumen: 'Approved',
      namaKaryawan: 'Siti Aminah',
      namaAkun: 'Biaya ATK',
      approver1: 'SPV Accounting',
      approver2: 'Manajer Keuangan',
      approver3: '—',
      approver4: '—',
      approver5: '—',
      keterangan: 'Pembelian ATK',
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                REIMBURSE / VOUCHER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Reimburse / Voucher</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Reimburse</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Reimburse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Reimburse (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Reimburse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Karyawan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Akun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver 5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noReimburse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglReimburse).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaDivisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noSO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.nominalReimburse.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        row.statusDokumen === 'Paid' ? 'bg-green-100 text-green-800' :
                        row.statusDokumen === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        row.statusDokumen === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.statusDokumen}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaKaryawan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaAkun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver1 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver2 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver3 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver4 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver5 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReimburseVoucherDashboard;
