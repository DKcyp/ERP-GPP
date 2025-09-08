import React from 'react';
import { Search, Target, Phone, Award, FileCheck, BarChart2 } from 'lucide-react';

const cards = [
  {
    title: 'Suspect',
    description: 'Rekap data awal calon client.',
    icon: Search,
    path: '/marketing/suspect/dashboard',
    accent: 'from-blue-500/10 to-blue-500/5 text-blue-600',
  },
  {
    title: 'Prospect',
    description: 'Prospect yang sedang di-follow up.',
    icon: Target,
    path: '/marketing/prospect/dashboard',
    accent: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
  },
  {
    title: 'Penawaran On Call',
    description: 'Rekap penawaran untuk pekerjaan on call.',
    icon: Phone,
    path: '/marketing/penawaran/on-call',
    accent: 'from-cyan-500/10 to-cyan-500/5 text-cyan-600',
  },
  {
    title: 'Penawaran Tender',
    description: 'Rekap penawaran tender dan statusnya.',
    icon: Award,
    path: '/marketing/penawaran/tender',
    accent: 'from-purple-500/10 to-purple-500/5 text-purple-600',
  },
  {
    title: 'Kontrak Deal',
    description: 'Rekap kontrak yang sudah deal.',
    icon: FileCheck,
    path: '/marketing/kontrak-deal/dashboard',
    accent: 'from-amber-500/10 to-amber-500/5 text-amber-600',
  },
];

const MarketingRekapDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">Rekap Marketing</h1>
        </div>
        <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
          Ringkasan cepat dan tautan langsung ke Suspect, Prospect, Penawaran, dan Kontrak Deal.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {cards.map(({ title, description, icon: Icon, path, accent }) => (
            <a
              key={title}
              href={path}
              className={`group block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`px-3 py-2 rounded-t-xl bg-gradient-to-br ${accent} border-b border-gray-100 flex items-center gap-2`}>
                <div className="p-1.5 rounded-md bg-white/70">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] md:text-xs font-semibold">{title}</span>
              </div>
              <div className="p-3">
                {/* Placeholder statistik singkat */}
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-xl md:text-2xl font-bold text-gray-800">-</span>
                  <span className="text-[10px] md:text-xs text-gray-500">item</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-600 line-clamp-2">{description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingRekapDashboard;
