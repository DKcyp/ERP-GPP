import React from 'react';
import { CheckCircle, Clock, FileText, Users, Award, ArrowRight } from 'lucide-react';

const vendors = [
  { name: 'PT. Permata Buana', status: 'Submitted', score: 88, avatar: 'https://i.pravatar.cc/150?u=permata' },
  { name: 'PT Makmur Sentosa', status: 'Evaluating', score: 92, avatar: 'https://i.pravatar.cc/150?u=makmur' },
  { name: 'PT Jaya Abadi', status: 'Submitted', score: 85, avatar: 'https://i.pravatar.cc/150?u=jaya' },
];

const timelineSteps = [
  { name: 'Bidding Created', status: 'completed', date: '08-02-2025' },
  { name: 'Vendor Invitation', status: 'completed', date: '09-02-2025' },
  { name: 'Proposal Submission', status: 'active', date: '15-02-2025' },
  { name: 'Technical Evaluation', status: 'pending', date: '18-02-2025' },
  { name: 'Commercial Evaluation', status: 'pending', date: '20-02-2025' },
  { name: 'Winner Selection', status: 'pending', date: '22-02-2025' },
];

const ProsesSeleksiSupplierDashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">PROSES SELEKSI SUPPLIER / BIDDING</h1>
          <p className="text-gray-500 mt-1">Detail proses untuk No. Bidding: <span className="font-semibold text-blue-600">BIDDING001</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Timeline & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Timeline Proses Bidding</h2>
              <div className="relative">
                {/* Line */}
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                
                {timelineSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 mb-6 last:mb-0">
                    <div className={`z-10 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500 text-white' :
                      step.status === 'active' ? 'bg-blue-500 text-white ring-4 ring-blue-200' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <p className={`font-semibold ${step.status === 'active' ? 'text-blue-600' : 'text-gray-800'}`}>{step.name}</p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bidding Details */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Bidding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium text-gray-600">No. PR:</span> <span className="text-gray-800">PR0030</span></div>
                <div><span className="font-medium text-gray-600">Departemen:</span> <span className="text-gray-800">Logistik</span></div>
                <div><span className="font-medium text-gray-600">Tanggal Bidding:</span> <span className="text-gray-800">08-02-2025</span></div>
                <div><span className="font-medium text-gray-600">Status:</span> <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">Proposal Submission</span></div>
                <div className="md:col-span-2"><span className="font-medium text-gray-600">Items:</span> <span className="text-gray-800">Peralatan Inspeksi, Alat keselamatan kerja, Kendaraan Operasional</span></div>
              </div>
            </div>
          </div>

          {/* Side Content: Vendors & Actions */}
          <div className="space-y-8">
            {/* Vendor List */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Users size={22} /> Peserta Vendor</h2>
              <div className="space-y-4">
                {vendors.map(vendor => (
                  <div key={vendor.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img src={vendor.avatar} alt={vendor.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{vendor.name}</p>
                      <p className={`text-xs font-medium ${vendor.status === 'Evaluating' ? 'text-blue-600' : 'text-gray-500'}`}>{vendor.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{vendor.score}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Award size={22} /> Aksi & Keputusan</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-semibold">
                  <FileText size={16} />
                  <span>Lihat Dokumen Penawaran</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-semibold">
                  <span>Lanjutkan ke Tahap Evaluasi</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProsesSeleksiSupplierDashboard;
