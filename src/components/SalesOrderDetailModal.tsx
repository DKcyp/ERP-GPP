import React from "react";
import { X } from "lucide-react";

export interface SalesOrderDetailData {
  noSO: string;
  nomorKontrak: string;
  namaClient: string;
  namaProyek: string;
  sow: string;
  lokasi: string;
  jenisPekerjaan: "On Call" | "Tender";
  tanggalMOB: string;
  tanggalDeMOB: string;
  tanggalDibuat: string;
  estimasiSO: string;
  keterangan?: string;
  tenagaKerja?: Array<Record<string, string>>;
  jasa?: Array<Record<string, string>>;
  alat?: Array<Record<string, string>>;
  barang?: Array<Record<string, string>>;
  mobDemob?: Array<Record<string, string>>;
  biayaLainLain?: Array<Record<string, string>>;
}

interface SalesOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SalesOrderDetailData | null;
}

const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2 items-start text-sm">
    <div className="text-gray-500">{label}</div>
    <div className="col-span-2 text-gray-900 font-medium break-words">{value || '-'}</div>
  </div>
);

const SalesOrderDetailModal: React.FC<SalesOrderDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const tabNames = [
    { key: 'tenagaKerja', label: 'Tenaga Kerja' },
    { key: 'jasa', label: 'Jasa' },
    { key: 'alat', label: 'Alat' },
    { key: 'barang', label: 'Barang' },
    { key: 'mobDemob', label: 'MobDemob' },
    { key: 'biayaLainLain', label: 'Biaya Lain-lain' },
  ] as const;

  const availableTabs = tabNames.filter(t => Array.isArray((data as any)[t.key]) && ((data as any)[t.key] as any[]).length > 0);
  const [activeTab, setActiveTab] = React.useState<string>(availableTabs[0]?.key || '');

  const getSubtotal = (key: string, rows: Array<Record<string,string>>): number => {
    // Prefer hargaAkhir when available; otherwise, try projectRate * hari
    return rows.reduce((sum, r) => {
      const akhir = parseFloat((r.hargaAkhir as string) || '');
      if (!isNaN(akhir)) return sum + akhir;
      const rate = parseFloat((r.projectRate as string) || '0');
      const qty = parseFloat((r.hari as string) || '0');
      if (!isNaN(rate) && !isNaN(qty)) return sum + rate * qty;
      return sum;
    }, 0);
  };

  const renderReadOnlyTable = (key: string) => {
    const rows = (data as any)[key] as Array<Record<string,string>>;
    if (!rows || rows.length === 0) return null;
    switch (key) {
      case 'tenagaKerja':
        return (
          <>
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left">Tenaga</th>
                  <th className="px-2 py-1 text-left">Tunjangan</th>
                  <th className="px-2 py-1 text-left">Project Rate</th>
                  <th className="px-2 py-1 text-left">Hari</th>
                  <th className="px-2 py-1 text-left">Margin</th>
                  <th className="px-2 py-1 text-left">Harga Akhir</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-1">{r.tenaga || '-'}</td>
                    <td className="px-2 py-1">{r.tunjangan || '-'}</td>
                    <td className="px-2 py-1">{r.projectRate || '-'}</td>
                    <td className="px-2 py-1">{r.hari || '-'}</td>
                    <td className="px-2 py-1">{r.margin || '-'}</td>
                    <td className="px-2 py-1">{r.hargaAkhir || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right text-xs font-medium text-gray-700 mt-2">Subtotal: Rp {getSubtotal(key, rows).toLocaleString('id-ID')}</div>
          </>
        );
      case 'jasa':
        return (
          <>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left">Jasa</th>
                <th className="px-2 py-1 text-left">Tunjangan</th>
                <th className="px-2 py-1 text-left">Project Rate</th>
                <th className="px-2 py-1 text-left">Hari</th>
                <th className="px-2 py-1 text-left">Margin</th>
                <th className="px-2 py-1 text-left">Harga Akhir</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1">{r.jasa || '-'}</td>
                  <td className="px-2 py-1">{r.tunjangan || '-'}</td>
                  <td className="px-2 py-1">{r.projectRate || '-'}</td>
                  <td className="px-2 py-1">{r.hari || '-'}</td>
                  <td className="px-2 py-1">{r.margin || '-'}</td>
                  <td className="px-2 py-1">{r.hargaAkhir || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-xs font-medium text-gray-700 mt-2">Subtotal: Rp {getSubtotal(key, rows).toLocaleString('id-ID')}</div>
          </>
        );
      case 'alat':
        return (
          <>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left">Alat</th>
                <th className="px-2 py-1 text-left">Jumlah</th>
                <th className="px-2 py-1 text-left">Hari</th>
                <th className="px-2 py-1 text-left">Satuan</th>
                <th className="px-2 py-1 text-left">Harga Satuan</th>
                <th className="px-2 py-1 text-left">Margin</th>
                <th className="px-2 py-1 text-left">Harga Akhir</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1">{r.alat || '-'}</td>
                  <td className="px-2 py-1">{r.jumlah || '-'}</td>
                  <td className="px-2 py-1">{r.hari || '-'}</td>
                  <td className="px-2 py-1">{r.satuan || '-'}</td>
                  <td className="px-2 py-1">{r.hargaSatuan || '-'}</td>
                  <td className="px-2 py-1">{r.margin || '-'}</td>
                  <td className="px-2 py-1">{r.hargaAkhir || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-xs font-medium text-gray-700 mt-2">Subtotal: Rp {getSubtotal(key, rows).toLocaleString('id-ID')}</div>
          </>
        );
      case 'barang':
        return (
          <>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left">Nama Barang</th>
                <th className="px-2 py-1 text-left">Jumlah</th>
                <th className="px-2 py-1 text-left">Hari</th>
                <th className="px-2 py-1 text-left">Satuan</th>
                <th className="px-2 py-1 text-left">Harga Satuan</th>
                <th className="px-2 py-1 text-left">Margin</th>
                <th className="px-2 py-1 text-left">Harga Akhir</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1">{r.namaBarang || '-'}</td>
                  <td className="px-2 py-1">{r.jumlah || '-'}</td>
                  <td className="px-2 py-1">{r.hari || '-'}</td>
                  <td className="px-2 py-1">{r.satuan || '-'}</td>
                  <td className="px-2 py-1">{r.hargaSatuan || '-'}</td>
                  <td className="px-2 py-1">{r.margin || '-'}</td>
                  <td className="px-2 py-1">{r.hargaAkhir || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-xs font-medium text-gray-700 mt-2">Subtotal: Rp {getSubtotal(key, rows).toLocaleString('id-ID')}</div>
          </>
        );
      case 'mobDemob':
      case 'biayaLainLain':
        return (
          <>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left">Nama</th>
                <th className="px-2 py-1 text-left">Tunjangan</th>
                <th className="px-2 py-1 text-left">Project Rate</th>
                <th className="px-2 py-1 text-left">Hari</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1">{r.namaTransportasi || r.namaBiaya || '-'}</td>
                  <td className="px-2 py-1">{r.tunjangan || '-'}</td>
                  <td className="px-2 py-1">{r.projectRate || '-'}</td>
                  <td className="px-2 py-1">{r.hari || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-xs font-medium text-gray-700 mt-2">Subtotal: Rp {getSubtotal(key, rows).toLocaleString('id-ID')}</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="text-lg font-bold text-gray-900">Detail Sales Order</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Summary Content */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Row label="Nomor SO" value={data.noSO} />
            <Row label="Nomor Kontrak" value={data.nomorKontrak} />
            <Row label="Nama Client" value={data.namaClient} />
            <Row label="Nama Proyek" value={data.namaProyek} />
            <Row label="Lokasi" value={data.lokasi} />
            <Row label="Jenis Pekerjaan" value={data.jenisPekerjaan} />
            <Row label="Tanggal Dibuat" value={data.tanggalDibuat} />
            <Row label="Estimasi SO" value={data.estimasiSO} />
          </div>

          {/* SOW */}
          <div className="space-y-1">
            <div className="text-sm text-gray-500">SOW</div>
            <div className="text-sm text-gray-900 border border-gray-200 rounded-lg p-3 bg-gray-50">
              {data.sow || '-'}
            </div>
          </div>

          {/* Tabs (read-only) directly below SOW */}
          {availableTabs.length > 0 && (
            <div className="pt-2">
              <div className="mb-2 flex flex-wrap gap-2 border-b border-gray-200">
                {availableTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t-md ${activeTab === t.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="border border-gray-200 rounded-md p-3 bg-white overflow-x-auto">
                {activeTab && renderReadOnlyTable(activeTab)}
              </div>
            </div>
          )}

          {/* Keterangan (optional) */}
          {data.keterangan !== undefined && (
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Keterangan</div>
              <div className="text-sm text-gray-900 border border-gray-200 rounded-lg p-3 bg-gray-50">
                {data.keterangan || '-'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-white">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetailModal;
