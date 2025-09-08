import React from 'react';

interface GATemplateProps {
  title: string;
  subtitle?: string;
}

const GATemplate: React.FC<GATemplateProps> = ({ title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-gray-600">
          <p>Halaman ini masih berupa template untuk GA. Silakan beritahu saya detail field dan tabel yang diinginkan agar saya buatkan sesuai UI Monitoring.</p>
        </div>
      </div>
    </div>
  );
};

export default GATemplate;
