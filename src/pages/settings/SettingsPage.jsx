import { useState, useEffect } from 'react';
import { Save, Globe, Truck, Settings as SettingsIcon, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('global');
  const [saveStatus, setSaveStatus] = useState(null);

  const [settings, setSettings] = useState({
    appName: 'Yes Karangue',
    defaultLanguage: 'Yes Karangue',
    timezone: 'Africa/Dakar',
    currency: 'F CFA',
    maxWeight: 50,
    stampPrice: 500,
    commission: 5,
    maintenanceMode: false,
    apiLimit: 1000,
    emailNotifications: true,
    smsNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const sections = [
    { id: 'global', label: 'Configuration globale', icon: Globe },
    { id: 'delivery', label: 'Paramètres de livraison', icon: Truck },
    { id: 'system', label: 'Paramètres système', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configurez les paramètres globaux de la plateforme</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-6">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                      ? 'bg-[#E0F2F1] text-[#2E7D8A]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#2E7D8A]' : 'text-gray-400'}`} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">

          {/* Configuration Globale */}
          <div id="global" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 scroll-mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Configuration globale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom de l'application <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Langue par défaut <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="defaultLanguage"
                  value={settings.defaultLanguage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fuseau horaire <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 appearance-none bg-white focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition cursor-pointer"
                  >
                    <option value="Africa/Dakar">Africa/Dakar</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Devises <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 appearance-none bg-white focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition cursor-pointer"
                  >
                    <option value="F CFA">F CFA</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres de livraison */}
          <div id="delivery" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 scroll-mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Paramètres de livraison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Poids maximal par colis (kg) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="maxWeight"
                  value={settings.maxWeight}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tarif timbre par kg (FCFA) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="stampPrice"
                  value={settings.stampPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Commission (%) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="commission"
                  value={settings.commission}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Paramètres système */}
          <div id="system" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 scroll-mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Paramètres système</h2>

            <div className="bg-gray-50/50 p-4 rounded-lg flex items-center justify-between mb-8 border border-gray-100">
              <div>
                <span className="block text-sm font-bold text-gray-900">Mode maintenance</span>
                <span className="text-xs text-gray-500 mt-1">Désactiver l'accès des utilisateurs pendant la maintenance</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E8B44D]"></div>
              </label>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Limite de requêtes API par heure <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="apiLimit"
                value={settings.apiLimit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2E7D8A]/20 focus:border-[#2E7D8A] outline-none transition"
              />
            </div>
          </div>

          {/* Notifications */}
          <div id="notifications" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 scroll-mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Notifications</h2>

            <div className="space-y-4">
              <div className="bg-[#FFF9F2] p-4 rounded-lg flex items-center justify-between border border-[#FDEECC]">
                <div>
                  <span className="block text-sm font-bold text-gray-900">Notifications par email</span>
                  <span className="text-xs text-gray-500 mt-1">Envoyer des notifications par email aux utilisateurs</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E8B44D]"></div>
                </label>
              </div>

              <div className="bg-[#FFF9F2] p-4 rounded-lg flex items-center justify-between border border-[#FDEECC]">
                <div>
                  <span className="block text-sm font-bold text-gray-900">Notifications par SMS</span>
                  <span className="text-xs text-gray-500 mt-1">Envoyer des notifications par SMS aux utilisateurs</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E8B44D]"></div>
                </label>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2.5 bg-[#407B8C] text-white rounded-lg font-medium hover:bg-[#356775] transition shadow-sm disabled:opacity-70 flex-1 md:flex-none justify-center"
              >
                {saveStatus === 'saving' ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <button
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm flex-1 md:flex-none justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
