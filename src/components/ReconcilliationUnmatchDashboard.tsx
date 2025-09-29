import React, { useState } from "react";
import { Search, Calendar } from "lucide-react";

interface MutasiData {
  id: number;
  tanggal: string;
  keterangan: string;
  noRef: string;
  debit: number;
  credit: number;
}

interface JurnalData {
  id: number;
  npwpPembeli: string;
  namaPembeli: string;
  kodeTransaksi: string;
  nomorFakturPajak: string;
  tanggalFakturPajak: string;
  hargaJualDpp: number;
  dppNilaiLain: number;
  ppn: number;
}

const initialMutasiData: MutasiData[] = [
  {
    id: 1,
    tanggal: "03-09-2025",
    keterangan:
      "TRSF E-BANKING CR 0209/FTSCY/WS95031 339149.00 NIKE CHANDRA DRG",
    noRef: "0",
    debit: 0,
    credit: 339149.0,
  },
  {
    id: 2,
    tanggal: "01-09-2025",
    keterangan: "BI-FAST CR TRANSFER DR 542 MUHAMMAD ARI KAFIN",
    noRef: "0",
    debit: 0,
    credit: 2357000.0,
  },
  {
    id: 3,
    tanggal: "02-09-2025",
    keterangan:
      "KR OTOMATIS TANGGAL :01/09 NTRF@930737450X0Z1 260@BCA25090181425 @@AFR Ferdina Recky",
    noRef: "0",
    debit: 0,
    credit: 520000.0,
  },
  {
    id: 4,
    tanggal: "03-09-2025",
    keterangan: "TRSF E-BANKING CR",
    noRef: "0",
    debit: 0,
    credit: 1239735.0,
  },
];

const initialJurnalData: JurnalData[] = [
  {
    id: 1,
    npwpPembeli: "73822123123123123",
    namaPembeli: "PT. JAYA ABADI SELALU",
    kodeTransaksi: "01",
    nomorFakturPajak: "010.001-23.0000001",
    tanggalFakturPajak: "01/09/2025",
    hargaJualDpp: 1000000,
    dppNilaiLain: 0,
    ppn: 110000,
  },
  {
    id: 2,
    npwpPembeli: "73822123123123123",
    namaPembeli: "PT. JAYA ABADI SELALU",
    kodeTransaksi: "01",
    nomorFakturPajak: "010.001-23.0000002",
    tanggalFakturPajak: "02/09/2025",
    hargaJualDpp: 2000000,
    dppNilaiLain: 0,
    ppn: 220000,
  },
];

const ReconcilliationUnmatchDashboard: React.FC = () => {
  const [filterMutasi, setFilterMutasi] = useState({
    periodeStart: "01/09/2025",
    periodeEnd: "03/09/2025",
    bank: "Bank In BCA-1260483222",
    nominal: "",
    noRef: "",
    keterangan: "",
  });

  const [filterJurnal, setFilterJurnal] = useState({
    periodeStart: "01/09/2025",
    periodeEnd: "03/09/2025",
    npwpPembeli: "- All NPWP -", // Changed from cabang
    nominal: "",
    nomorFakturPajak: "", // Changed from noJurnal
    namaPembeli: "", // Changed from deskripsi
    kodeTransaksi: "", // Changed from keterangan
  });

  const [mutasiData, setMutasiData] = useState<MutasiData[]>(initialMutasiData);
  const [jurnalData, setJurnalData] = useState<JurnalData[]>(initialJurnalData);
  const [selectedMutasi, setSelectedMutasi] = useState<MutasiData[]>([]);
  const [selectedJurnal, setSelectedJurnal] = useState<JurnalData[]>([]);

  const handleSearchMutasi = () => {
    console.log("Searching Mutasi with:", filterMutasi);
    // Implement actual search logic here
  };

  const handleSearchJurnal = () => {
    console.log("Searching Jurnal with:", filterJurnal);
    // Implement actual search logic here
  };

  const handleMutasiCheckboxChange = (item: MutasiData, isChecked: boolean) => {
    setSelectedMutasi((prev) =>
      isChecked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
    );
  };

  const handleJurnalCheckboxChange = (item: JurnalData, isChecked: boolean) => {
    setSelectedJurnal((prev) =>
      isChecked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Rekonsiliasi Pajak Keluaran
          </h1>
          {/* "Batal Pasang" button */}
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Filter Data Daftar Mutasi */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Filter Data Daftar Pajak Keluaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="periodeStartMutasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Periode
                </label>
                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <input
                      type="text" // Changed to text to match the dd/mm/yyyy format in the image
                      id="periodeStartMutasi"
                      value={filterMutasi.periodeStart}
                      onChange={(e) =>
                        setFilterMutasi({
                          ...filterMutasi,
                          periodeStart: e.target.value,
                        })
                      }
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar
                      size={18}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                  <span className="flex items-center text-gray-500">s/d</span>
                  <div className="relative w-1/2">
                    <input
                      type="text" // Changed to text to match the dd/mm/yyyy format in the image
                      id="periodeEndMutasi"
                      value={filterMutasi.periodeEnd}
                      onChange={(e) =>
                        setFilterMutasi({
                          ...filterMutasi,
                          periodeEnd: e.target.value,
                        })
                      }
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar
                      size={18}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="bankMutasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bank
                </label>
                <div className="relative min-w-0">
                  <select
                    id="bankMutasi"
                    value={filterMutasi.bank}
                    onChange={(e) =>
                      setFilterMutasi({ ...filterMutasi, bank: e.target.value })
                    }
                    className="w-full appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 truncate"
                  >
                    <option value="">Bank In BCA-1260483222</option>
                    {/* Add more bank options here */}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* simple caret icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="nominalMutasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nominal
                </label>
                <input
                  type="text"
                  id="nominalMutasi"
                  value={filterMutasi.nominal}
                  onChange={(e) =>
                    setFilterMutasi({
                      ...filterMutasi,
                      nominal: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nominal"
                />
              </div>
              <div>
                <label
                  htmlFor="noRefMutasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No Referensi
                </label>
                <input
                  type="text"
                  id="noRefMutasi"
                  value={filterMutasi.noRef}
                  onChange={(e) =>
                    setFilterMutasi({ ...filterMutasi, noRef: e.target.value })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="No Referensi"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="keteranganMutasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Keterangan
                </label>
                <input
                  type="text"
                  id="keteranganMutasi"
                  value={filterMutasi.keterangan}
                  onChange={(e) =>
                    setFilterMutasi({
                      ...filterMutasi,
                      keterangan: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Keterangan"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleSearchMutasi}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Filter Data Daftar Jurnal */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Filter Data Daftar Pajak Keluaran Coretax
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="periodeStartJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Periode
                </label>
                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <input
                      type="text" // Changed to text to match the dd/mm/yyyy format in the image
                      id="periodeStartJurnal"
                      value={filterJurnal.periodeStart}
                      onChange={(e) =>
                        setFilterJurnal({
                          ...filterJurnal,
                          periodeStart: e.target.value,
                        })
                      }
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar
                      size={18}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                  <span className="flex items-center text-gray-500">s/d</span>
                  <div className="relative w-1/2">
                    <input
                      type="text" // Changed to text to match the dd/mm/yyyy format in the image
                      id="periodeEndJurnal"
                      value={filterJurnal.periodeEnd}
                      onChange={(e) =>
                        setFilterJurnal({
                          ...filterJurnal,
                          periodeEnd: e.target.value,
                        })
                      }
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar
                      size={18}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="npwpPembeliJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  NPWP Pembeli
                </label>
                <select
                  id="npwpPembeliJurnal"
                  value={filterJurnal.npwpPembeli}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      npwpPembeli: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">- All NPWP -</option>
                  {/* Add more NPWP options here */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="nominalJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nominal
                </label>
                <input
                  type="text"
                  id="nominalJurnal"
                  value={filterJurnal.nominal}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      nominal: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nominal"
                />
              </div>
              <div>
                <label
                  htmlFor="nomorFakturPajakJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No Faktur Pajak
                </label>
                <input
                  type="text"
                  id="nomorFakturPajakJurnal"
                  value={filterJurnal.nomorFakturPajak}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      nomorFakturPajak: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="No Faktur Pajak"
                />
              </div>
              <div>
                <label
                  htmlFor="namaPembeliJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Pembeli
                </label>
                <input
                  type="text"
                  id="namaPembeliJurnal"
                  value={filterJurnal.namaPembeli}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      namaPembeli: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama Pembeli"
                />
              </div>
              <div>
                <label
                  htmlFor="kodeTransaksiJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kode Transaksi
                </label>
                <input
                  type="text"
                  id="kodeTransaksiJurnal"
                  value={filterJurnal.kodeTransaksi}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      kodeTransaksi: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Kode Transaksi"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleSearchJurnal}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pajak Keluaran */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Daftar Pajak Keluaran
            </h2>
            <div className="flex justify-between items-center mb-4">
              <div>
                <label
                  htmlFor="showMutasi"
                  className="text-sm font-medium text-gray-700"
                >
                  Show{" "}
                </label>
                <select
                  id="showMutasi"
                  className="border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm font-medium text-gray-700">
                  {" "}
                  entries
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  size={18}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th scope="col" className="p-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Tanggal
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Keterangan
                    </th>
                    <th scope="col" className="px-3 py-3">
                      No Ref
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      Debit
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      Credit
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mutasiData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedMutasi.some(
                            (sItem) => sItem.id === item.id
                          )}
                          onChange={(e) =>
                            handleMutasiCheckboxChange(item, e.target.checked)
                          }
                        />
                      </td>
                      <td className="px-3 py-4">{item.tanggal}</td>
                      <td className="px-3 py-4">{item.keterangan}</td>
                      <td className="px-3 py-4">{item.noRef}</td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.debit)}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.credit)}
                      </td>
                      <td className="px-3 py-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-ellipsis-vertical"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                Showing 1 to 10 of {mutasiData.length} entries
              </span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-500 text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Daftar Jurnal */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              Pajak Keluaran Coretax
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Import
              </button>
            </h2>
            <div className="flex justify-between items-center mb-4">
              <div>
                <label
                  htmlFor="showJurnal"
                  className="text-sm font-medium text-gray-700"
                >
                  Show{" "}
                </label>
                <select
                  id="showJurnal"
                  className="border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm font-medium text-gray-700">
                  {" "}
                  entries
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  size={18}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th scope="col" className="p-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th scope="col" className="px-3 py-3">
                      NPWP Pembeli/Identitas Lainnya
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Nama Pembeli
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Kode Transaksi
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Nomor Faktur Pajak
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Tanggal Faktur Pajak
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      Harga Jual/Penggantian/DPP
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      DPP Nilai Lain/DPP
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      PPN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jurnalData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    jurnalData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedJurnal.some(
                              (sItem) => sItem.id === item.id
                            )}
                            onChange={(e) =>
                              handleJurnalCheckboxChange(item, e.target.checked)
                            }
                          />
                        </td>
                        <td className="px-3 py-4">{item.npwpPembeli}</td>
                        <td className="px-3 py-4">{item.namaPembeli}</td>
                        <td className="px-3 py-4">{item.kodeTransaksi}</td>
                        <td className="px-3 py-4">{item.nomorFakturPajak}</td>
                        <td className="px-3 py-4">{item.tanggalFakturPajak}</td>
                        <td className="px-3 py-4 text-right">
                          {formatCurrency(item.hargaJualDpp)}
                        </td>
                        <td className="px-3 py-4 text-right">
                          {formatCurrency(item.dppNilaiLain)}
                        </td>
                        <td className="px-3 py-4 text-right">
                          {formatCurrency(item.ppn)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                Showing 0 to 0 of {jurnalData.length} entries
              </span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-500 text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-start">
        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Batal Pasang
        </button>
      </div>
    </div>
  );
};

export default ReconcilliationUnmatchDashboard;
