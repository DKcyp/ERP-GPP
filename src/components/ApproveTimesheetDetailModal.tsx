import React, { useEffect } from 'react';
import { X, Calendar, Upload, ThumbsUp, ThumbsDown } from 'lucide-react';

// Local mirror of data shape used in parent (kept minimal for modal needs)
interface ApprovalTimesheetPegawaiData {
  id: string;
  nama: string;
  mob: string;
  demob: string;
  durasi: string;
  noSO: string;
  noHPP: string;
  namaProject: string;
  namaClient: string;
  kualifikasi: string[];
  lokasi: string;
  jenisPekerjaan: string;
  jamAwalKerja: string;
  jamSelesaiKerja: string;
  overtime: string;
  tunjangan: { namaTunjangan: string; rateTunjangan: string; overtime: string }[];
  status: 'Menunggu Review' | 'Release' | 'Approve' | 'Rejected';
}

interface ApproveTimesheetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  timesheetData: ApprovalTimesheetPegawaiData | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRelease: (id: string) => void;
}

const ApproveTimesheetDetailModal: React.FC<ApproveTimesheetDetailModalProps> = ({
  isOpen,
  onClose,
  timesheetData,
  onApprove,
  onReject,
  onRelease,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !timesheetData) return null;

  const isApprove = timesheetData.status === 'Approve';
  const isRejected = timesheetData.status === 'Rejected';
  const isRelease = timesheetData.status === 'Release';
  const isMenungguReview = timesheetData.status === 'Menunggu Review';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Approve Timesheet Pegawai</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.nama}
              </p>
            </div>

            {/* MOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MOB</label>
              <div className="relative">
                <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 pr-10">
                  {timesheetData.mob}
                </p>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* DEMOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DEMOB</label>
              <div className="relative">
                <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 pr-10">
                  {timesheetData.demob}
                </p>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Durasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durasi</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.durasi}
              </p>
            </div>

            {/* No SO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.noSO}
              </p>
            </div>

            {/* No SO Turunan (No HPP) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No SO Turunan</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.noHPP}
              </p>
            </div>

            {/* Nama Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Project</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.namaProject}
              </p>
            </div>

            {/* Nama Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Client</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.namaClient}
              </p>
            </div>

            {/* Kualifikasi */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kualifikasi</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-100 border border-gray-200 rounded-xl">
                {timesheetData.kualifikasi.map((kualifikasi, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800"
                  >
                    {kualifikasi}
                  </span>
                ))}
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.lokasi}
              </p>
            </div>

            {/* Jenis Pekerjaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pekerjaan</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.jenisPekerjaan}
              </p>
            </div>

            {/* Dokumen Timesheet */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dokumen Timesheet</label>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Upload className="h-4 w-4" />
                <span>Unduh Timesheet</span>
              </button>
            </div>

            {/* Jam Awal Kerja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jam Awal Kerja</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.jamAwalKerja}
              </p>
            </div>

            {/* Jam Selesai Kerja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jam Selesai Kerja</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.jamSelesaiKerja}
              </p>
            </div>

            {/* Overtime */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Overtime</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {timesheetData.overtime}
              </p>
            </div>

            {/* Tunjangan Section */}
            <div className="mt-6 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tunjangan</label>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Tunjangan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate Tunjangan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Overtime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {timesheetData.tunjangan.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.namaTunjangan}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.rateTunjangan}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.overtime || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>

          {isMenungguReview && (
            <>
              <button
                type="button"
                onClick={() => onRelease(timesheetData.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Release</span>
              </button>
              <button
                type="button"
                onClick={() => onReject(timesheetData.id)}
                disabled={isRejected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>{isRejected ? 'Rejected' : 'Reject'}</span>
              </button>
            </>
          )}

          {isRelease && (
            <>
              <button
                type="button"
                onClick={() => onApprove(timesheetData.id)}
                disabled={isApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{isApprove ? 'Approved' : 'Approve'}</span>
              </button>
              <button
                type="button"
                onClick={() => onReject(timesheetData.id)}
                disabled={isRejected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>{isRejected ? 'Rejected' : 'Reject'}</span>
              </button>
            </>
          )}
          {/* When status is Approve -> no action buttons shown */}
        </div>
      </div>
    </div>
  );
};

export default ApproveTimesheetDetailModal;
