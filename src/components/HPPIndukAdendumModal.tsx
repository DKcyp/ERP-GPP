import React, { useState } from "react";
import { X } from "lucide-react";
import { HPPIndukFormData } from './HPPIndukModal';

interface HPPIndukAdendumModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HPPIndukFormData;
}

const HPPIndukAdendumModal: React.FC<HPPIndukAdendumModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [activeTab, setActiveTab] = useState("Tenaga Kerja");

  if (!isOpen) return null;

  const tabs = [
    "Tenaga Kerja",
    "Jasa", 
    "Alat",
    "Barang",
    "PPE",
    "Mob/Demob",
    "Biaya Lain Lain"
  ];

  const satuanOptions = ["Orang", "Unit", "Paket", "Buah", "Meter", "Kg", "Liter"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Adendum HPP Induk</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Contract Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Kontrak
              </label>
              <input
                type="text"
                value={data.noKontrak}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi Kontrak
              </label>
              <input
                type="text"
                value={data.durasiKontrak}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Client
              </label>
              <input
                type="text"
                value={data.namaClient}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Pekerjaan
              </label>
              <input
                type="text"
                value={data.lokasiPekerjaan}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Project
              </label>
              <input
                type="text"
                value={data.namaProject}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Pekerjaan
              </label>
              <input
                type="text"
                value={data.jenisPekerjaan}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimasi Nilai Kontrak
              </label>
              <input
                type="text"
                value={data.estimasiNilaiKontrak}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sertifikat
              </label>
              <input
                type="text"
                value={data.sertifikat ? data.sertifikat.name : "Tidak ada file"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Pekerjaan Ringkas Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pekerjaan Ringkas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Jenis Pekerjaan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Harga Satuan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Jumlah</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pekerjaanRingkas.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border-r">
                        <input
                          type="text"
                          value={item.jenisPekerjaan}
                          readOnly
                          className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                        />
                      </td>
                      <td className="px-4 py-2 border-r">
                        <input
                          type="text"
                          value={item.hargaSatuan}
                          readOnly
                          className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                        />
                      </td>
                      <td className="px-4 py-2 border-r">
                        <input
                          type="text"
                          value={item.jumlah}
                          readOnly
                          className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item.total}
                          readOnly
                          className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "Tenaga Kerja" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Tenaga Kerja</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Tenaga</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Tunjangan</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Project Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Jumlah</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Satuan</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Harga Awal</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Margin (%)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Harga Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tenagaKerja.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.tenaga}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.tunjangan}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.projectRate}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.jumlah}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.satuan}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.hargaAwal}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.margin}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.hargaAkhir}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Jasa Tab */}
          {activeTab === "Jasa" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Jasa</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Jasa</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Tunjangan</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Project Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Jumlah</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Satuan</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Harga Awal</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Margin (%)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Harga Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.jasa.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.jasa}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.tunjangan}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.projectRate}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.jumlah}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.satuan}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.hargaAwal}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 border-r">
                          <input
                            type="text"
                            value={item.margin}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.hargaAkhir}
                            readOnly
                            className="w-full px-2 py-1 border-0 bg-transparent text-gray-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
