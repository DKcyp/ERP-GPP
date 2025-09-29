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

interface PajakMasukanData {
  id: number;
  npwpPenjual: string;
  namaPenjual: string;
  nomorFakturPajak: string;
  tanggalFakturPajak: string;
  hargaJualDpp: number;
  dppNilaiLain: number;
  ppn: number;
}

const initialMutasiData: MutasiData[] = [
  {
    id: 1,
    tanggal: "01-08-2025",
    keterangan:
      "KR OTOMATIS MID: 885000964044 COBRA DENTAL INDON QR: 9669670 00 DDR: 67887.67",
    noRef: "998",
    debit: 0,
    credit: 9601982.33,
  },
  {
    id: 2,
    tanggal: "01-08-2025",
    keterangan: "BI-FAST CR TRANSFER DR 002 KADEK AYU HAPSARI",
    noRef: "0,00",
    debit: 0,
    credit: 485000.0,
  },
  {
    id: 3,
    tanggal: "02-08-2025",
    keterangan:
      "TRSF E-BANKING CR 0208FTSCYWS905051 1472000.00 LEONA JAYA PERKASA",
    noRef: "0,00",
    debit: 0,
    credit: 1472000.0,
  },
  {
    id: 4,
    tanggal: "04-08-2025",
    keterangan: "BI-FAST CR TRANSFER DR 022 PKU MUHAMMADIYAH S",
    noRef: "0,00",
    debit: 0,
    credit: 4772900.0,
  },
];

const initialPajakMasukanData: PajakMasukanData[] = [
  {
    id: 1,
    npwpPenjual: "01.234.567.8-901.000",
    namaPenjual: "PT SUMBER REJEKI MAKMUR",
    nomorFakturPajak: "010.000-25.00000001",
    tanggalFakturPajak: "15-01-2025",
    hargaJualDpp: 10000000,
    dppNilaiLain: 0,
    ppn: 1100000,
  },
  {
    id: 2,
    npwpPenjual: "02.345.678.9-012.000",
    namaPenjual: "CV MITRA SEJAHTERA",
    nomorFakturPajak: "010.000-25.00000002",
    tanggalFakturPajak: "16-01-2025",
    hargaJualDpp: 5000000,
    dppNilaiLain: 500000,
    ppn: 605000,
  },
];

const ReconcilliationMatchDashboard: React.FC = () => {
  const [filterMutasi, setFilterMutasi] = useState({
    periodeStart: "01-08-2025",
    periodeEnd: "01-09-2025",
    bank: "Bank In BCA-1260755555",
    nominal: "",
    noRef: "",
    keterangan: "",
  });

  const [filterJurnal, setFilterJurnal] = useState({
    npwpPenjual: "",
    namaPenjual: "",
    nomorFakturPajak: "",
    tanggalFakturPajak: "",
    hargaJualDpp: "",
    ppn: "",
  });

  const [mutasiData, setMutasiData] = useState<MutasiData[]>(initialMutasiData);
  const [pajakMasukanData, setPajakMasukanData] = useState<PajakMasukanData[]>(
    initialPajakMasukanData
  );
  const [selectedMutasi, setSelectedMutasi] = useState<MutasiData[]>([]);
  const [selectedPajakMasukan, setSelectedPajakMasukan] = useState<
    PajakMasukanData[]
  >([]);

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

  const handlePajakMasukanCheckboxChange = (
    item: PajakMasukanData,
    isChecked: boolean
  ) => {
    setSelectedPajakMasukan((prev) =>
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

  // Totals for selected items
  const totalMutasi = selectedMutasi.reduce(
    (sum, i) => sum + (i.debit || 0) + (i.credit || 0),
    0
  );
  const totalPajakMasukan = selectedPajakMasukan.reduce(
    (sum, i) =>
      sum + (i.hargaJualDpp || 0) + (i.dppNilaiLain || 0) + (i.ppn || 0),
    0
  );

  const handleRekonsiliasi = () => {
    console.log("Rekonsiliasi clicked", {
      selectedMutasi,
      selectedPajakMasukan,
      totalMutasi,
      totalPajakMasukan,
    });
    // TODO: Implement reconciliation action
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Rekonsiliasi Pajak Masukan
          </h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Match Selected
          </button>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Filter Data Daftar Mutasi */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Filter Data Pajak Masukkan{" "}
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

          {/* Filter Data Pajak Masukan Coretax */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Filter Data Pajak Masukan Coretax
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="npwpPenjual"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  NPWP Penjual
                </label>
                <input
                  type="text"
                  id="npwpPenjual"
                  value={filterJurnal.npwpPenjual}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      npwpPenjual: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="NPWP Penjual"
                />
              </div>
              <div>
                <label
                  htmlFor="namaPenjual"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Penjual
                </label>
                <input
                  type="text"
                  id="namaPenjual"
                  value={filterJurnal.namaPenjual}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      namaPenjual: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama Penjual"
                />
              </div>
              <div>
                <label
                  htmlFor="nomorFakturPajak"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor Faktur Pajak
                </label>
                <input
                  type="text"
                  id="nomorFakturPajak"
                  value={filterJurnal.nomorFakturPajak}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      nomorFakturPajak: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nomor Faktur Pajak"
                />
              </div>
              <div>
                <label
                  htmlFor="tanggalFakturPajak"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tanggal Faktur Pajak
                </label>
                <input
                  type="text"
                  id="tanggalFakturPajak"
                  value={filterJurnal.tanggalFakturPajak}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      tanggalFakturPajak: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div>
                <label
                  htmlFor="hargaJualDpp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Harga Jual/DPP
                </label>
                <input
                  type="text"
                  id="hargaJualDpp"
                  value={filterJurnal.hargaJualDpp}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      hargaJualDpp: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Harga Jual/DPP"
                />
              </div>
              <div>
                <label
                  htmlFor="ppnFilter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PPN
                </label>
                <input
                  type="text"
                  id="ppnFilter"
                  value={filterJurnal.ppn}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      ppn: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="PPN"
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
          {/* Daftar Mutasi */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pajak Masukkan{" "}
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

          {/* Pajak Masukan Coretax */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pajak Masukan Coretax
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
                      NPWP Penjual
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Nama Penjual
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
                  {pajakMasukanData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedPajakMasukan.some(
                            (sItem) => sItem.id === item.id
                          )}
                          onChange={(e) =>
                            handlePajakMasukanCheckboxChange(
                              item,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-4">{item.npwpPenjual}</td>
                      <td className="px-3 py-4">{item.namaPenjual}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                Showing 1 to 10 of {pajakMasukanData.length} entries
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

        {/* Data Mutasi Terpilih */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pajak Masukkan Terpilih
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Action
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
                </tr>
              </thead>
              <tbody>
                {selectedMutasi.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  selectedMutasi.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <button
                          onClick={() =>
                            handleMutasiCheckboxChange(item, false)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Showing 0 to 0 of {selectedMutasi.length} entries
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

        {/* Data Jurnal Terpilih */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Masukan Coretax Terpilih
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Action
                  </th>
                  <th scope="col" className="px-3 py-3">
                    NPWP Penjual
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Nama Penjual
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
                {selectedPajakMasukan.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  selectedPajakMasukan.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <button
                          onClick={() =>
                            handlePajakMasukanCheckboxChange(item, false)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                      <td className="px-3 py-4">{item.npwpPenjual}</td>
                      <td className="px-3 py-4">{item.namaPenjual}</td>
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
              Showing 0 to 0 of {selectedPajakMasukan.length} entries
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
        {/* Bottom Summary Bar */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Total Mutasi</span>
              <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 min-w-[160px] text-right">
                {formatCurrency(totalMutasi)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Total Pajak Masukan</span>
              <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 min-w-[160px] text-right">
                {formatCurrency(totalPajakMasukan)}
              </div>
            </div>
          </div>
          <button
            onClick={handleRekonsiliasi}
            className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm"
          >
            Rekonsiliasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReconcilliationMatchDashboard;
