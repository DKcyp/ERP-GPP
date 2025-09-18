import React from 'react';
import { X } from 'lucide-react';
import { EvaluasiVendorData } from '../types';

interface EvaluasiVendorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: EvaluasiVendorData | null;
}

const EvaluasiVendorDetailModal: React.FC<EvaluasiVendorDetailModalProps> = ({ isOpen, onClose, vendor }) => {
  if (!isOpen || !vendor) return null;

  const criteriaData = [
    {
      no: "1.",
      category: "SAFETY",
      items: [
        {
          code: "a.",
          name: "Kebijakan K3L",
          satisfaction: {
            A: "Mempunyai kebijakan K3L secara tertulis dilaksanakan setiap karyawan",
            B: "Mempunyai kebijakan K3L secara tertulis tetapi belum terlaksana dengan baik",
            C: "Mempunyai kebijakan K3L secara tertulis tetapi belum berjalan",
            D: "Tidak memiliki kebijakan K3L"
          }
        },
        {
          code: "b.",
          name: "Sistem Manajemen K3L",
          satisfaction: {
            A: "Memiliki panduan K3L tertulis, dilaksanakan sesuai prosedur dan memiliki bukti dokumen.",
            B: "Memiliki panduan K3L tertulis, dilaksanakan sesuai prosedur tetapi tidak memiliki bukti dokumen.",
            C: "Memiliki panduan K3L tertulis, tetapi tidak dilaksanakan dengan baik",
            D: "Tidak memiliki standar pelaksanaan K3L."
          }
        },
        {
          code: "c.",
          name: "Alat Perlindungan Diri (APD)",
          satisfaction: {
            A: "Alat perlindungan diri standar untuk karyawan & terdapat bukti dokumen serah terima APD.",
            B: "Alat perlindungan diri standar untuk karyawan tetapi tidak ada dokumen serah terima.",
            C: "Alat perlindungan diri disediakan secara terbatas.",
            D: "Tidak tersedia alat perlindungan diri."
          }
        },
        {
          code: "d.",
          name: "Alat Kerja",
          satisfaction: {
            A: "Tersedia peralatan kerja yang memadai penggunaan dan pemeriksaannya dilakukan dengan baik dan dilengkapi dengan dokumen pendukung",
            B: "Tersedia peralatan kerja yang memadai penggunaan dan pemeriksaannya dilakukan dengan baik tetapi tidak dilengkapi dokumen",
            C: "Tersedia peralatan kerja yang memadai, tetapi penggunaan, pemeriksaan dan dokumentasinya tidak ada.",
            D: "Tidak tersedia alat kerja yang memadai dan tidak ada pengawasan."
          }
        },
        {
          code: "e.",
          name: "Organisasi K3L",
          satisfaction: {
            A: "Memiliki panduan manajemen K3L, dilaksanakan sesuai prosedur dan memiliki bukti",
            B: "Memiliki panduan manajemen K3L, dilaksanakan sesuai prosedur tetapi tidak",
            C: "Memiliki panduan manajemen K3L tetapi tidak dilaksanakan dengan baik.",
            D: "Tidak memiliki panduan K3L manajemen yang baik"
          }
        }
      ]
    },
    {
      no: "2.",
      category: "TECHNICAL EXPERTISES",
      items: [
        {
          code: "",
          name: "",
          satisfaction: {
            A: "Memiliki pengetahuan pengalaman atas barang/jasa yg di- tawarkan dan memiliki kerjasama dengan pemasang merk dagang tertentu (principal)",
            B: "Memiliki pengetahuan pengalaman atas barang/jasa yg ditawarkan tetapi tidak memiliki kerjasama dengan pemasang merk dagang tertentu (principal)",
            C: "Memiliki pengetahuan tetapi tidak pengalaman atas barang/jasa yang ditawarkan",
            D: "Tidak memiliki pengetahuan dan pengalaman atas barang/ jasa yang ditawarkan"
          }
        }
      ]
    },
    {
      no: "3.",
      category: "QA/QC",
      items: [
        {
          code: "",
          name: "",
          satisfaction: {
            A: "Memiliki panduan untuk standar pelayanan atas barang/jasa yang ditawarkan dan dijelaskan sesuai prosedur serta dilengkapi bukti dokumen",
            B: "Memiliki panduan untuk standar pelayanan atas barang/jasa yang ditawarkan dan dijelaskan sesuai prosedur serta tidak memiliki dokumen",
            C: "Memiliki panduan untuk standar pelayanan atas barang/jasa yang ditawarkan tetapi tidak dijelaskan dengan baik",
            D: "Tidak memiliki panduan untuk standar pelayanan atas barang/ jasa yang ditawarkan"
          }
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">EVALUASI VENDOR - {vendor.namaVendor}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Header Info */}
          <div className="mb-6 text-sm">
            <p><strong>Vendor:</strong> {vendor.namaVendor}</p>
            <p><strong>Tanggal Evaluasi:</strong> {vendor.tanggalEvaluasi}</p>
          </div>

          {/* Evaluation Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="border border-gray-400 px-2 py-2 text-center font-bold">NO</th>
                  <th rowSpan={2} className="border border-gray-400 px-2 py-2 text-center font-bold">CRITERIA</th>
                  <th colSpan={4} className="border border-gray-400 px-2 py-2 text-center font-bold">SATISFACTION</th>
                  <th rowSpan={2} className="border border-gray-400 px-2 py-2 text-center font-bold">POINT</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-2 text-center font-bold">GOOD<br/>A</th>
                  <th className="border border-gray-400 px-2 py-2 text-center font-bold">GOOD<br/>B</th>
                  <th className="border border-gray-400 px-2 py-2 text-center font-bold">FAIR<br/>C</th>
                  <th className="border border-gray-400 px-2 py-2 text-center font-bold">POOR<br/>D</th>
                </tr>
              </thead>
              <tbody>
                {criteriaData.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    {/* Category Header */}
                    <tr>
                      <td rowSpan={section.items.length + 1} className="border border-gray-400 px-2 py-2 text-center font-bold align-top">
                        {section.no}
                      </td>
                      <td className="border border-gray-400 px-2 py-2 font-bold">{section.category}</td>
                      <td className="border border-gray-400 px-2 py-2"></td>
                      <td className="border border-gray-400 px-2 py-2"></td>
                      <td className="border border-gray-400 px-2 py-2"></td>
                      <td className="border border-gray-400 px-2 py-2"></td>
                      <td className="border border-gray-400 px-2 py-2"></td>
                    </tr>
                    
                    {/* Items */}
                    {section.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td className="border border-gray-400 px-2 py-2">
                          {item.code} {item.name}
                        </td>
                        <td className="border border-gray-400 px-2 py-2 text-xs">{item.satisfaction.A}</td>
                        <td className="border border-gray-400 px-2 py-2 text-xs">{item.satisfaction.B}</td>
                        <td className="border border-gray-400 px-2 py-2 text-xs">{item.satisfaction.C}</td>
                        <td className="border border-gray-400 px-2 py-2 text-xs">{item.satisfaction.D}</td>
                        <td className="border border-gray-400 px-2 py-2"></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                
                {/* Total Point Row */}
                <tr className="bg-gray-100">
                  <td colSpan={5} className="border border-gray-400 px-2 py-2 text-right font-bold">TOTAL POINT</td>
                  <td className="border border-gray-400 px-2 py-2 font-bold"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-bold mb-2">Hasil Evaluasi:</h3>
              <p><strong>On Time:</strong> {vendor.onTime}</p>
              <p><strong>Sesuai Spesifikasi:</strong> {vendor.sesuaiSpesifikasi}</p>
              <p><strong>Mutu:</strong> {vendor.mutu}</p>
              <p><strong>K3:</strong> {vendor.k3}</p>
              <p><strong>Jumlah Barang Sesuai PO:</strong> {vendor.jumlahBarangSesuaiPO}%</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">After Sales:</h3>
              <p><strong>Tanggal Garansi:</strong> {vendor.tanggalGaransi || 'Tidak ada'}</p>
              <p><strong>Keterangan Administrasi:</strong></p>
              <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                {vendor.keteranganAdministrasiVendor || 'Tidak ada keterangan'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluasiVendorDetailModal;
