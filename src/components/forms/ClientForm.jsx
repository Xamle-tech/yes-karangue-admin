import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

export default function ClientForm({ client, onSubmit, onBack }) {
  const [formData, setFormData] = useState(
    client || {
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'EXP_DEST',
      has_app: false,
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition border border-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {client ? client.name : 'Ajouter un client'}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Clients</span>
            <span>&gt;</span>
            <span>{client ? `Client N° ${client.id}` : 'Ajouter un client'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Informations générales</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Nom complet */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Moussa Ndiaye"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#305669]/20 focus:border-[#305669] transition outline-none bg-white"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            {/* Type de client */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Type de client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#305669]/20 focus:border-[#305669] transition outline-none bg-white appearance-none"
                >
                  <option value="EXP_DEST">Exp. & Dest.</option>
                  <option value="SENDER">Expéditeur uniquement</option>
                  <option value="RECIPIENT">Destinataire uniquement</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: moussa.ndiaye@yeskarangue.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#305669]/20 focus:border-[#305669] transition outline-none bg-white"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-gray-200">
                  <span className="text-lg">🇸🇳</span>
                  <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+221 77 123 45 67"
                  className="w-full pl-24 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#305669]/20 focus:border-[#305669] transition outline-none bg-white"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Adresse complète <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ex: Dakar, Point E"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#305669]/20 focus:border-[#305669] transition outline-none bg-white"
                />
              </div>
            </div>

            {/* App Downloaded Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Le client a téléchargé l'application <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center pt-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, has_app: !prev.has_app }))}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#305669] focus:ring-offset-2 ${formData.has_app ? 'bg-[#305669]' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${formData.has_app ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl font-medium text-white shadow-sm transition flex items-center gap-2 ${client ? 'bg-[#E8B44D] hover:bg-[#D9A53C]' : 'bg-[#305669] hover:bg-[#254252]'}`}
            >
              {client ? 'Mettre à jour' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
