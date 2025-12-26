import { Menu, Bell, User, Search, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  onToggleMobileSidebar,
  onLogout,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Récupérer le rôle et l'email de l'utilisateur
  const userRole = localStorage.getItem('userRole') || 'admin';
  const userEmail = localStorage.getItem('userEmail') || 'admin@yeskarangue.com';
  const isAgent = userRole === 'agent';

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      onLogout();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
          title="Basculer la barre latérale"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
          title="Basculer le menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900">Notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <p className="font-medium text-gray-900 text-sm">Nouveau colis reçu</p>
                  <p className="text-xs text-gray-600 mt-1">
                    YK-2025-00105 enregistré avec succès
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Il y a 5 minutes</p>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <p className="font-medium text-gray-900 text-sm">Timbre de livraison confirmé</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Paiement de 5000 FCFA confirmé pour YK-2025-00104
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Il y a 15 minutes</p>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer transition">
                  <p className="font-medium text-gray-900 text-sm">Nouveau transporteur enregistré</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Transport Dakar Express s'est inscrit
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Il y a 1 heure</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <a
                  href="#"
                  className="text-sm font-medium text-[#305669] hover:underline"
                >
                  Voir toutes les notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B9BAD] to-[#4A8999] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {isAgent ? 'MG' : 'AD'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                {isAgent ? 'Moustapha Gueye' : 'Administrateur'}
              </p>
              <p className="text-xs text-gray-500">{isAgent ? 'Agent' : 'Super Admin'}</p>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{userEmail}</p>
                <p className="text-xs text-gray-500 mt-1">{isAgent ? 'Agent' : 'Administrateur'}</p>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Profil
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Paramètres
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Aide
                </button>
              </div>
              <div className="p-2 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
