import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Settings,
  LogOut,
  SendHorizontal,
  ClipboardList,
  MapPin,
} from 'lucide-react';

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer le rôle de l'utilisateur
  const userRole = localStorage.getItem('userRole') || 'admin';
  const isAgent = userRole === 'agent';

  // Menu pour Admin (complet)
  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
    { icon: Users, label: 'Utilisateurs', path: '/users' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Package, label: 'Colis', path: '/shipments' },
    { icon: Truck, label: 'Transporteurs', path: '/transporters' },
    { icon: MapPin, label: 'Points de Retrait', path: '/points' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];
  
  // Menu pour Agent (simplifié - uniquement colis)
  const agentMenuItems = [
    { icon: ClipboardList, label: 'Gestion des Colis', path: '/agent' },
  ];
  
  // Choisir le bon menu selon le rôle
  const menuItems = isAgent ? agentMenuItems : adminMenuItems;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#305669] to-[#1F3A4A] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">YK</span>
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-gray-900 text-sm">YES KARANGUE</p>
              <p className="text-xs text-gray-600">{isAgent ? 'Agent' : 'Admin'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-2 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-[#305669] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
