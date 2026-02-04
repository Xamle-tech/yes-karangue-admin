import { useState, useEffect } from 'react';
import { Truck, Bell } from 'lucide-react';
import { fetchSettings, updateSettings } from '../../services/settingsService';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('delivery');
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [settings, setSettings] = useState({
    maxWeight: 50,
    stampPrice: 500,
    commission: 5,
    emailNotifications: true,
    smsNotifications: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSettings();
        setSettings(prev => ({
          ...prev,
          maxWeight: data.maxWeight ?? prev.maxWeight,
          stampPrice: data.stampPrice ?? prev.stampPrice,
          commission: data.commission ?? prev.commission,
          emailNotifications: data.emailNotifications ?? prev.emailNotifications,
          smsNotifications: data.smsNotifications ?? prev.smsNotifications,
        }));
      } catch (err) {
        console.error('Erreur chargement paramètres:', err);
        setError('Impossible de charger les paramètres.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setError(null);
    try {
      await updateSettings({
        commission: Number(settings.commission),
        maxWeight: Number(settings.maxWeight),
        stampPrice: Number(settings.stampPrice),
        emailNotifications: Boolean(settings.emailNotifications),
        smsNotifications: Boolean(settings.smsNotifications),
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus(null);
      setError(err.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  const sections = [
    { id: 'delivery', label: 'Paramètres de livraison', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configurez les paramètres globaux de la plateforme (stockés en base de données)</p>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
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
                <p className="text-xs text-gray-500 mt-1.5">Pour le transporteur : pour chaque colis transporté, ce pourcentage du montant du timbre lui revient.</p>
              </div>
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
