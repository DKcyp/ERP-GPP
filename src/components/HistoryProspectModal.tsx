import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryProspectData {
  no: number;
  namaProspek: string;
  status: "Warm" | "Cold" | "Hot";
  tanggalKontak: string;
  metodeKontak: string;
  topikPembicaraan: string;
  hasil: string;
  tindakLanjut: string;
  catatan: string;
}

const HistoryProspectModal: React.FC<HistoryProspectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const parseDDMMYYYY = (s: string): Date => {
    const [dd, mm, yyyy] = s.split("/");
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const diffDays = (a: Date, b: Date): number => {
    const ms = a.getTime() - b.getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  };

  // Sample data matching the image
  const historyData: HistoryProspectData[] = [
    {
      no: 1,
      namaProspek: "PT Maju Jaya",
      status: "Warm",
      tanggalKontak: "17/01/2024",
      metodeKontak: "Telepon",
      topikPembicaraan: "Presentasi produk baru",
      hasil: "Tertarik dengan produk",
      tindakLanjut: "Follow up minggu depan",
      catatan: "Perlu proposal detail",
    },
    {
      no: 2,
      namaProspek: "PT Maju Jaya",
      status: "Cold",
      tanggalKontak: "15/01/2024",
      metodeKontak: "Pertemuan",
      topikPembicaraan: "Diskusi harga dan syarat pembayaran",
      hasil: "Masih pertimbangan",
      tindakLanjut: "Tunggu keputusan",
      catatan: "Budget terbatas",
    },
  ];

  // Precompute dates for duration calculations
  const mapped = historyData.map((h) => ({
    ...h,
    _date: parseDDMMYYYY(h.tanggalKontak),
  }));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot":
        return "bg-red-500 text-white";
      case "Warm":
        return "bg-yellow-500 text-white";
      case "Cold":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">History Prospect</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Nama Prospek
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Tanggal Kontak
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Metode Kontak
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Topik Pembicaraan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Hasil
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Tindak Lanjut
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      Catatan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                      SLH
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mapped.map((item, index) => (
                    <tr
                      key={item.no}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      } hover:bg-blue-50 transition-colors duration-200`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-medium">
                        {item.namaProspek}
                      </td>
                      <td className="px-4 py-3 text-sm border border-gray-200">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.tanggalKontak}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.metodeKontak}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.topikPembicaraan}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.hasil}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.tindakLanjut}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                        {item.catatan}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 border border-gray-200">
                        {(() => {
                          const prev = mapped[index + 1]?._date;
                          const sincePrev = prev
                            ? diffDays(item._date, prev)
                            : null;
                          const sinceNow = diffDays(today, item._date);
                          return (
                            <div className="space-y-1">
                              <div>
                                <span className="text-gray-500"></span>{" "}
                                <span className="font-medium text-gray-900">
                                  {sincePrev !== null
                                    ? `${sincePrev}hari`
                                    : "-"}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">1 of 1</span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryProspectModal;
