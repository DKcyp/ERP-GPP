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
  tanggal: string;
  noJurnal: string;
  deskripsi: string;
  keterangan: string;
  noRef: string;
  debit: number;
  credit: number;
  cabang: string;
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

const initialJurnalData: JurnalData[] = [
  {
    id: 1,
    tanggal: "01-09-2025",
    noJurnal: "JV/09/25/0365072",
    deskripsi:
      "Rekon C021.00746/4 | PENJUALAN TOKO PLG003 ] BANK=5555 TGL=02-09-25 CR=29671511.28",
    keterangan: "Rekonsiliasi Bank C021",
    noRef: "C021",
    debit: 0,
    credit: 0,
    cabang: "",
  },
  {
    id: 2,
    tanggal: "01-09-2025",
    noJurnal: "JV/09/25/0365072",
    deskripsi:
      "Rekon PUL09/2025/217086 Biaya Pencarian QRS | Penjualan Toko PLG C021.0618880 PJL atas nama C021.0074973 ] PENJUALAN TOKO",
    keterangan: "Rekonsiliasi Bank C021",
    noRef: "C021",
    debit: 0,
    credit: 0,
    cabang: "",
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
    cabang: "- All Cabang -",
    nominal: "",
    noJurnal: "",
    deskripsi: "",
    keterangan: "",
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
            Transaksi Rekonsiliasi Match
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
              Filter Data Daftar Mutasi
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
                  <input
                    type="date"
                    id="periodeStartMutasi"
                    value={filterMutasi.periodeStart}
                    onChange={(e) =>
                      setFilterMutasi({
                        ...filterMutasi,
                        periodeStart: e.target.value,
                      })
                    }
                    className="w-1/2 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="flex items-center text-gray-500">s/d</span>
                  <input
                    type="date"
                    id="periodeEndMutasi"
                    value={filterMutasi.periodeEnd}
                    onChange={(e) =>
                      setFilterMutasi({
                        ...filterMutasi,
                        periodeEnd: e.target.value,
                      })
                    }
                    className="w-1/2 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="bankMutasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bank
                </label>
                <select
                  id="bankMutasi"
                  value={filterMutasi.bank}
                  onChange={(e) =>
                    setFilterMutasi({ ...filterMutasi, bank: e.target.value })
                  }
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Bank In BCA-1260755555</option>
                  {/* Add more bank options here */}
                </select>
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
              Filter Data Daftar Jurnal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cabangJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cabang
                </label>
                <select
                  id="cabangJurnal"
                  value={filterJurnal.cabang}
                  onChange={(e) =>
                    setFilterJurnal({ ...filterJurnal, cabang: e.target.value })
                  }
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">- All Cabang -</option>
                  {/* Add more cabang options here */}
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
                  htmlFor="noJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No Jurnal
                </label>
                <input
                  type="text"
                  id="noJurnal"
                  value={filterJurnal.noJurnal}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      noJurnal: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="No Jurnal"
                />
              </div>
              <div>
                <label
                  htmlFor="deskripsiJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <input
                  type="text"
                  id="deskripsiJurnal"
                  value={filterJurnal.deskripsi}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deskripsi"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="keteranganJurnal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Keterangan
                </label>
                <input
                  type="text"
                  id="keteranganJurnal"
                  value={filterJurnal.keterangan}
                  onChange={(e) =>
                    setFilterJurnal({
                      ...filterJurnal,
                      keterangan: e.target.value,
                    })
                  }
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Keterangan"
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
              Daftar Mutasi
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

          {/* Daftar Jurnal */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Daftar Jurnal
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
                      Tanggal
                    </th>
                    <th scope="col" className="px-3 py-3">
                      No Jurnal
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Deskripsi
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
                      Cabang
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jurnalData.map((item) => (
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
                      <td className="px-3 py-4">{item.tanggal}</td>
                      <td className="px-3 py-4">{item.noJurnal}</td>
                      <td className="px-3 py-4">{item.deskripsi}</td>
                      <td className="px-3 py-4">{item.keterangan}</td>
                      <td className="px-3 py-4">{item.noRef}</td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.debit)}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.credit)}
                      </td>
                      <td className="px-3 py-4">{item.cabang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                Showing 1 to 10 of {jurnalData.length} entries
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
            Data Mutasi Terpilih
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
            Data Jurnal Terpilih
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
                    No Jurnal
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Deskripsi
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
                    Cabang
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedJurnal.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  selectedJurnal.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <button
                          onClick={() =>
                            handleJurnalCheckboxChange(item, false)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                      <td className="px-3 py-4">{item.tanggal}</td>
                      <td className="px-3 py-4">{item.noJurnal}</td>
                      <td className="px-3 py-4">{item.deskripsi}</td>
                      <td className="px-3 py-4">{item.keterangan}</td>
                      <td className="px-3 py-4">{item.noRef}</td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.debit)}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.credit)}
                      </td>
                      <td className="px-3 py-4">{item.cabang}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Showing 0 to 0 of {selectedJurnal.length} entries
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
  );
};

export default ReconcilliationMatchDashboard;
