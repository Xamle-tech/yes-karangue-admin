import { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { fetchRelayPoints } from '../../services/relayPointService';

export default function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: user?.name || user?.full_name || '',
    role: (user?.role || '').toString().toUpperCase() || '',
    email: user?.email || '',
    phone: user?.phone || '',
    relay_point_id: user?.relay_point_id || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relayPoints, setRelayPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  useEffect(() => {
    const loadRelayPoints = async () => {
      try {
        setLoadingPoints(true);
        const response = await fetchRelayPoints({ limit: 100 }); // Fetch enough points
        // Handle pagination or data wrappers
        const points = Array.isArray(response) ? response : (response.data || []);
        setRelayPoints(points);
      } catch (error) {
        console.error('Erreur chargement points:', error);
      } finally {
        setLoadingPoints(false);
      }
    };
    loadRelayPoints();
  }, []);

  const roleOptions = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'AGENT', label: 'Agent' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Le nom complet est requis';
    if (!formData.role) newErrors.role = 'Le rôle est requis';
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.phone) {
      newErrors.phone = 'Le téléphone est requis';
    }
    // Add more validation if needed
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Point de retrait réservé aux agents : retirer si on passe en admin
      if (name === 'role' && value !== 'AGENT') {
        next.relay_point_id = '';
      }
      return next;
    });
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        relay_point_id: formData.role === 'AGENT' && formData.relay_point_id
          ? parseInt(formData.relay_point_id, 10)
          : null
      };
      await onSubmit(payload);
    } catch (error) {
      setErrors({ submit: error.message || 'Une erreur est survenue' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user ? user.full_name || user.name : 'Ajouter un utilisateur'}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>Utilisateurs</span>
            <span>&gt;</span>
            <span>{user ? `Utilisateur N° ${user.id}` : 'Ajouter un utilisateur'}</span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <User className="h-5 w-5 text-[#5B9BAD]" />
          <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Nom complet & Rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Ex: Moussa Ndiaye"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent outline-none transition"
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent outline-none transition appearance-none bg-white"
                >
                  <option value="">Sélectionner</option>
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Row 2: Email & Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!user} // Email often immutable on edit or depends on backend, keeping editable for now unless specified
                // Note: In edit image 3, it looks editable.
                placeholder="Ex: moussa.ndiaye@yeskarangue.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent outline-none transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50">
                  <span className="text-lg">🇸🇳</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+221 77 123 45 67"
                  className="w-full px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent outline-none transition"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Row 3: Point de retrait (uniquement pour les agents) */}
            {formData.role === 'AGENT' && (
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Point de retrait
                </label>
                <div className="relative">
                  <select
                    name="relay_point_id"
                    value={formData.relay_point_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent outline-none transition appearance-none bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {relayPoints.map(rp => (
                      <option key={rp.id} value={rp.id}>{rp.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#5B9BAD] text-white rounded-lg font-medium hover:bg-[#4A8999] transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Traitement...' : user ? 'Mettre à jour' : 'Enregistrer'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
