import React from 'react';
import {
  BarChart3, TrendingUp, Users, DollarSign, Calendar, Target, Award, Clock, Menu, Phone, Megaphone,
  FileText, ArrowRight, ArrowLeft, File, CheckCircle,
  Package, Banknote, ShoppingCart, Settings, ShieldCheck // New icons for departmental dashboards
} from 'lucide-react';

// Define the structure for a dashboard link
interface DashboardLink {
  name: string;
  path: string;
  icon: React.ElementType; // Type for Lucide icon components
  description: string;
}

// Configuration for departmental dashboards
const departmentDashboards: DashboardLink[] = [
  { name: 'Procon Dashboard', path: '/procon/dashboard', icon: FileText, description: 'Manage projects and contracts.' },
  { name: 'Accounting Dashboard', path: '/accounting/dashboard', icon: DollarSign, description: 'Oversee financial records and transactions.' },
  { name: 'QHSE Dashboard', path: '/qhse/dashboard', icon: ShieldCheck, description: 'Monitor quality, health, safety, and environment.' },
  { name: 'Gudang Dashboard', path: '/gudang/dashboard', icon: Package, description: 'Manage warehouse inventory and logistics.' },
  { name: 'Finance Dashboard', path: '/finance/dashboard', icon: Banknote, description: 'Access financial reports and budgeting.' },
  { name: 'Pengadaan Dashboard', path: '/pengadaan/dashboard', icon: ShoppingCart, description: 'Handle procurement and vendor management.' },
  { name: 'HRD Dashboard', path: '/hrd/dashboard', icon: Users, description: 'Manage human resources and employee data.' },
  { name: 'Operational Dashboard', path: '/operational/dashboard', icon: Settings, description: 'Monitor daily operations and efficiency.' },
  { name: 'Marketing Dashboard', path: '/marketing/dashboard', icon: Megaphone, description: 'Review marketing campaigns and performance.' },
];

// Management Main Dashboard Component
const ManagementMainDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-100 p-8 rounded-lg shadow-lg">
    <div className="max-w-7xl mx-auto">
      {/* New Section: Departmental Dashboards */}
      <div className="mt-10 p-8 bg-gradient-to-br from-[#9E7FFF]/10 to-[#9E7FFF]/5 rounded-xl shadow-inner border border-[#9E7FFF]/20">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Departmental Dashboards</h3>
        <p className="text-lg text-gray-700 mb-8">
          Quickly navigate to specific departmental dashboards for detailed oversight and management.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departmentDashboards.map((dashboard) => {
            const Icon = dashboard.icon; // Component for the icon
            return (
              <a
                key={dashboard.name}
                href={dashboard.path}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-[#9E7FFF] transition-all duration-300 transform hover:-translate-y-1"
              >
                <Icon className="w-12 h-12 text-[#9E7FFF] mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{dashboard.name}</h4>
                <p className="text-gray-600 text-sm">{dashboard.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default ManagementMainDashboard;
