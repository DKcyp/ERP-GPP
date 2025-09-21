import React from 'react';

interface BASerahTerimaItem {
  id: string;
  nomorBA: string;
  tanggalBA: string;
  penyerah: string;
  penerima: string;
  namaAsset: string;
  nomorAsset: string;
  kodeAsset: string;
  jumlah: number;
  keterangan: string;
  kondisi: 'Baik' | 'Rusak' | 'Perlu Perbaikan';
  status: 'Draft' | 'Selesai' | 'Pending';
}

interface Props {
  data: BASerahTerimaItem;
  onClose: () => void;
}

const BASerahTerimaPrintTemplate: React.FC<Props> = ({ data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getKondisiText = (kondisi: string) => {
    switch (kondisi) {
      case 'Baik': return 'Kondisi Baik SN 123654209';
      case 'Rusak': return 'Kondisi Rusak SN 123654868';
      case 'Perlu Perbaikan': return 'Kondisi Perlu Perbaikan SN 123459004';
      default: return 'Kondisi Baik';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header Controls - Hidden in print */}
        <div className="p-4 border-b border-gray-200 print:hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Preview Cetakan BA Serah Terima</h3>
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        {/* Print Content */}
        <div className="p-8 print:p-0">
          <div className="print-content bg-white">
            {/* Header Table */}
            <table className="w-full border-collapse border border-black text-sm">
              <tr>
                <td rowSpan={4} className="border border-black p-2 w-24 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-1">
                      <span className="text-xs font-bold text-black">gbp</span>
                    </div>
                  </div>
                </td>
                <td className="border border-black p-2 text-center font-bold text-lg" colSpan={3}>
                  FORMULIR
                </td>
                <td className="border border-black p-1 text-xs">No. Dokumen</td>
                <td className="border border-black p-1 text-xs">GBP-HG-FM-01</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold text-base" colSpan={3}>
                  TANDA TERIMA ASET PERUSAHAAN
                </td>
                <td className="border border-black p-1 text-xs">No. Revisi</td>
                <td className="border border-black p-1 text-xs">0</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-xs" colSpan={3}>
                  © Perusahaan/ Rev. 00 / 22 Agustus 2019
                </td>
                <td className="border border-black p-1 text-xs">Tanggal Revisi</td>
                <td className="border border-black p-1 text-xs">22 Agustus 2019</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-xs" colSpan={3}></td>
                <td className="border border-black p-1 text-xs">Halaman</td>
                <td className="border border-black p-1 text-xs">1 dari 1</td>
              </tr>
            </table>

            {/* Employee Info Table */}
            <table className="w-full border-collapse border border-black text-sm mt-4">
              <tr>
                <td className="border border-black p-2 w-32">Nama Karyawan</td>
                <td className="border border-black p-2">: {data.penerima}</td>
                <td className="border border-black p-2 w-24">No. Form</td>
                <td className="border border-black p-2">: 003-2025-09</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Departemen</td>
                <td className="border border-black p-2">: GA</td>
                <td className="border border-black p-2">Tgl Serah Terima</td>
                <td className="border border-black p-2">: {formatDate(data.tanggalBA)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Jabatan</td>
                <td className="border border-black p-2">: Staff</td>
                <td className="border border-black p-2" colSpan={2}></td>
              </tr>
            </table>

            {/* Introduction Text */}
            <div className="mt-4 mb-4">
              <table className="w-full border-collapse border border-black text-sm">
                <tr>
                  <td className="border border-black p-2">Pada Yth.</td>
                  <td className="border border-black p-2" colSpan={3}></td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Bapak/Ibu</td>
                  <td className="border border-black p-2" colSpan={3}></td>
                </tr>
              </table>
            </div>

            <p className="text-sm mb-4 leading-relaxed">
              Sebelumnya, kami mengucapkan selamat datang dan selamat atas bergabungnya Bapak/Ibu dengan PT. Gamma 
              Buana Persada
            </p>
            <p className="text-sm mb-4 leading-relaxed">
              Berikut ini adalah asset yang kami serahterimakan ke Bapak/Ibu, untuk digunakan dalam mendukung pekerjaan sehari-hari
            </p>

            {/* Asset Table */}
            <table className="w-full border-collapse border border-black text-sm mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-center">No.</th>
                  <th className="border border-black p-2 text-center">Nama Asset</th>
                  <th className="border border-black p-2 text-center">Kode Asset</th>
                  <th className="border border-black p-2 text-center">Jumlah</th>
                  <th className="border border-black p-2 text-center">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2">{data.namaAsset}</td>
                  <td className="border border-black p-2 text-center">{data.kodeAsset}</td>
                  <td className="border border-black p-2 text-center">{data.jumlah}</td>
                  <td className="border border-black p-2">{getKondisiText(data.kondisi)}</td>
                </tr>
                {/* Empty rows for template consistency */}
                {[2, 3, 4, 5, 6, 7].map(num => (
                  <tr key={num}>
                    <td className="border border-black p-2 text-center">{num}</td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Text */}
            <p className="text-sm mt-4 leading-relaxed">
              Saya menyadari bahwa saya telah menerima asset perusahaan yang disebutkan di atas. Saya menyetujui bahwa asset 
              tersebut adalah milik perusahaan dan saya bertanggung jawab untuk memelihara asset tersebut agar dapat digunakan 
              dengan baik dan menjaganya dengan sebaik-baiknya.
            </p>

            {/* Signature Section */}
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-sm mb-16">Yang Menyerahkan</p>
                <div className="border-b border-black w-48 mx-auto mb-2"></div>
                <p className="text-sm">({data.penyerah})</p>
              </div>
              <div className="text-center">
                <p className="text-sm mb-16">Yang Menerima</p>
                <div className="border-b border-black w-48 mx-auto mb-2"></div>
                <p className="text-sm">({data.penerima})</p>
              </div>
            </div>

            {/* Date and Location */}
            <div className="mt-8 text-right">
              <p className="text-sm">Jakarta, {formatDate(data.tanggalBA)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BASerahTerimaPrintTemplate;
