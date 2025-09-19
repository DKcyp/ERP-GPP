import React from 'react';
import '../styles/print.css';

interface PIEntry {
  id: string;
  clientName: string;
  soInduk: string;
  soTurunan: string;
  documentDate: string;
  salesName: string;
  item: string;
  taxType: 'PPN' | 'Non PPN';
  dueDate: string;
  contractOrPO: string;
  bankCode: string;
  nilaiKontrak?: number;
}

interface ProformaInvoicePrintTemplateProps {
  data: PIEntry;
  onClose: () => void;
  onPrint: () => void;
}

const ProformaInvoicePrintTemplate: React.FC<ProformaInvoicePrintTemplateProps> = ({
  data,
  onClose,
  onPrint
}) => {
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
    onPrint();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Print Controls */}
      <div className="print:hidden bg-gray-100 p-4 border-b flex justify-between">
        <h2 className="text-lg font-semibold">Preview Proforma Invoice</h2>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">
            Cetak
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">
            Tutup
          </button>
        </div>
      </div>

      {/* Print Content */}
      <div className="print-template p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 pb-6">
          <h1 className="text-2xl font-bold mb-2">PT. GLOBAL PRIMA PERKASA</h1>
          <p className="text-sm text-gray-600">
            Jl. Contoh Alamat No. 123, Jakarta 12345<br/>
            Telp: (021) 1234-5678 | Email: info@gpp.co.id
          </p>
          <h2 className="text-xl font-bold text-blue-600 mt-4">PROFORMA INVOICE</h2>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Informasi Invoice</h3>
            <div className="space-y-2 text-sm">
              <div className="flex"><span className="w-32">No. Invoice:</span><span>PI-{data.id}</span></div>
              <div className="flex"><span className="w-32">Tanggal:</span><span>{data.documentDate}</span></div>
              <div className="flex"><span className="w-32">Sales:</span><span>{data.salesName}</span></div>
              <div className="flex"><span className="w-32">Jatuh Tempo:</span><span>{data.dueDate}</span></div>
              <div className="flex"><span className="w-32">Pajak:</span><span>{data.taxType}</span></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Kepada Yth.</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{data.clientName}</p>
              <div className="flex"><span className="w-32">SO Induk:</span><span>{data.soInduk}</span></div>
              <div className="flex"><span className="w-32">SO Turunan:</span><span>{data.soTurunan}</span></div>
              <div className="flex"><span className="w-32">No. Kontrak:</span><span>{data.contractOrPO}</span></div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 border-b pb-2">Rincian Layanan</h3>
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left border">No.</th>
                <th className="p-3 text-left border">Deskripsi</th>
                <th className="p-3 text-center border">Qty</th>
                <th className="p-3 text-right border">Harga</th>
                <th className="p-3 text-right border">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">1</td>
                <td className="p-3 border">{data.item}</td>
                <td className="p-3 text-center border">1</td>
                <td className="p-3 text-right border">{data.nilaiKontrak ? formatRupiah(data.nilaiKontrak) : '-'}</td>
                <td className="p-3 text-right border font-semibold">{data.nilaiKontrak ? formatRupiah(data.nilaiKontrak) : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-80 border rounded">
            <div className="bg-gray-50 p-3 border-b"><h4 className="font-semibold">Ringkasan</h4></div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between"><span>Subtotal:</span><span>{data.nilaiKontrak ? formatRupiah(data.nilaiKontrak) : '-'}</span></div>
              {data.taxType === 'PPN' && (
                <div className="flex justify-between"><span>PPN (11%):</span><span>{data.nilaiKontrak ? formatRupiah(data.nilaiKontrak * 0.11) : '-'}</span></div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{data.nilaiKontrak ? formatRupiah(data.taxType === 'PPN' ? data.nilaiKontrak * 1.11 : data.nilaiKontrak) : '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 border-b pb-2">Informasi Pembayaran</h3>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Rekening Bank:</h4>
              <p>Bank: {data.bankCode}</p>
              <p>No. Rekening: 1234567890</p>
              <p>Atas Nama: PT. Global Prima Perkasa</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ketentuan:</h4>
              <p>• Pembayaran paling lambat: {data.dueDate}</p>
              <p>• Transfer bank</p>
              <p>• Konfirmasi ke finance@gpp.co.id</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 pt-6">
          <div className="grid grid-cols-2">
            <div>
              <p className="text-sm mb-4">Hormat kami,</p>
              <div className="mt-16">
                <div className="border-b w-48 mb-1"></div>
                <p className="font-semibold">{data.salesName}</p>
                <p className="text-xs text-gray-600">Sales Representative</p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              Dicetak: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoicePrintTemplate;
