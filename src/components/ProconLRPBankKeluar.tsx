import React from 'react';
import { Banknote, Clock } from 'lucide-react';

const ProconLRPBankKeluar: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LRP - Bank Keluar</h1>
            <div className="text-sm text-gray-600">Procon › Laba Rugi Project › Bank Keluar</div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-600">
          <Banknote className="h-10 w-10 mx-auto mb-3 text-blue-600" />
          <div className="font-medium">Halaman Bank Keluar (placeholder)</div>
        </div>
      </div>
    </div>
  );
};

export default ProconLRPBankKeluar;
