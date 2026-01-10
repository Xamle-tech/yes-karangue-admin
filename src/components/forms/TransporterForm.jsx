import { useState, useEffect } from 'react';
import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { fetchRelayPoints } from '../../services/relayPointService';

export default function TransporterForm({ transporter, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    full_name: transporter?.name || '',
    email: transporter?.email || '',
    phone: transporter?.phone || '',
    vehicle_type: transporter?.transporter_profile?.vehicle_type || 'moto',
    vehicle_plate: transporter?.transporter_profile?.vehicle_plate || '',
    insurer_name: transporter?.transporter_profile?.insurer_name || '',
    insurance_expires_at: transporter?.transporter_profile?.insurance_expires_at || '',
    station_id: transporter?.transporter_profile?.station_id || '',
    password: transporter ? '' : 'password123', // Pas de mot de passe requis en modif
    status: transporter?.status || 'active',
  });

  const [files, setFiles] = useState({
    id_card_front: null,
    id_card_back: null,
    vehicle_registration_card: null,
    vehicle_photos: null,
  });

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Le nom complet est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    if (!formData.vehicle_type) newErrors.vehicle_type = 'Le type de véhicule est requis';

    // station_id est souvent requis par l'API — forcer la sélection
    if (!formData.station_id) newErrors.station_id = 'Le point (station) est requis';

    // Validation des fichiers pour la création
    if (!transporter) {
      if (!files.id_card_front) newErrors.id_card_front = 'Recto CNI requis';
      if (!files.id_card_back) newErrors.id_card_back = 'Verso CNI requis';
      // Autres fichiers peuvent être optionnels selon le cas, mais souvent requis
    }

    return newErrors;
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
      const data = new FormData();
      // Champs texte (on n'ajoute pas station_id si vide)
      Object.keys(formData).forEach(key => {
        if (key === 'station_id') {
          if (formData.station_id) {
            // s'assurer d'envoyer une valeur numérique en chaîne
            data.append('station_id', String(Number(formData.station_id)));
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      // Statut si présent
      if (formData.status) data.append('status', formData.status);

      // Password seulement si renseigné (ou création)
      if (formData.password) data.append('password', formData.password);

      // Fichiers
      if (files.id_card_front) data.append('id_card_front', files.id_card_front);
      if (files.id_card_back) data.append('id_card_back', files.id_card_back);
      if (files.vehicle_registration_card) data.append('vehicle_registration_card', files.vehicle_registration_card);

      // Photos du véhicule (array)
      if (files.vehicle_photos) {
        // Si c'est une FileList (multiple)
        if (files.vehicle_photos instanceof FileList) {
          Array.from(files.vehicle_photos).forEach((file) => {
            data.append('vehicle_photos[]', file);
          });
        } else {
          // Si un seul fichier
          data.append('vehicle_photos[]', files.vehicle_photos);
        }
      }

      await onSubmit(data);
    } catch (error) {
      console.error('Erreur soumission:', error);
      setErrors({ submit: error.message || 'Une erreur est survenue' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Charger les stations (points de retrait) si nécessaire
  useEffect(() => {
    const loadStations = async () => {
      try {
        setStationsLoading(true);
        setStationsError(null);
        // debug: token presence
        console.log('🔎 Loading stations. token present:', !!localStorage.getItem('authToken'));
        const data = await fetchRelayPoints({ limit: 100 });
        console.log('🔎 fetchRelayPoints response:', data);
        // L'API peut retourner {data: [...]} ou un tableau
        const items = Array.isArray(data) ? data : (data.data || data.items || []);
        setStations(items);
        if (!items || items.length === 0) {
          setStationsError('Aucun point trouvé');
        }
      } catch (err) {
        console.warn('Erreur chargement stations:', err);
        setStations([]);
        setStationsError(err.message || 'Erreur chargement points');

        // DEBUG FALLBACK: tenter un fetch non-authentifié vers l'endpoint public pour vérifier si la ressource est accessible
        try {
          fetch('https://yes-karangue-api-production.up.railway.app/api/v1/admin/relay-points?limit=100')
            .then((r) => {
              console.log('Fallback raw response status:', r.status);
              return r.json().catch(() => null);
            })
            .then((publicData) => {
              console.log('Fallback public fetch data:', publicData);
              const items2 = publicData ? (Array.isArray(publicData) ? publicData : (publicData.data || publicData.items || [])) : [];
              if (items2 && items2.length > 0) {
                setStations(items2);
                setStationsError('Chargé via fallback non authentifié — vérifiez l\'authentification');
              }
            })
            .catch((fallbackErr) => console.warn('Fallback fetch failed:', fallbackErr));
        } catch (fallbackErr) {
          console.warn('Fallback fetch threw:', fallbackErr);
        }
      } finally {
        setStationsLoading(false);
      }
    };

    loadStations();
  }, []);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      if (name === 'vehicle_photos') {
        setFiles(prev => ({ ...prev, [name]: selectedFiles })); // FileList pour multiple
      } else {
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
      }

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {transporter ? 'Modifier le transporteur' : 'Ajouter un transporteur'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
            type="button"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Info Perso */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Informations Personnelles</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Info Véhicule */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Informations Véhicule</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                >
                  <option value="moto">Moto</option>
                  <option value="voiture">Voiture</option>
                  <option value="camion">Camion</option>
                  <option value="fourgon">Fourgon</option>
                </select>
              </div>

              {/* Status (seulement en modification pour l'instant) */}
              {transporter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="banned">Banni</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Point / Station *</label>
                <select
                  name="station_id"
                  value={formData.station_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                >
                  {stationsLoading ? (
                    <option value="" disabled>Chargement des points...</option>
                  ) : stations.length === 0 ? (
                    <option value="" disabled>Aucun point disponible</option>
                  ) : (
                    <>
                      <option value="">Sélectionner un point...</option>
                      {stations.map((s) => (
                        <option key={s.id} value={s.id}>{s.name || s.title || `#${s.id}`}</option>
                      ))}
                    </>
                  )}
                </select>
                {errors.station_id && <p className="text-red-500 text-xs mt-1">{errors.station_id}</p>}
                {stationsError && <p className="text-red-500 text-xs mt-1">{stationsError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                <input
                  type="text"
                  name="vehicle_plate"
                  value={formData.vehicle_plate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assurance</label>
                <input
                  type="text"
                  name="insurer_name"
                  placeholder="Nom assureur"
                  value={formData.insurer_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Assurance</label>
                <input
                  type="date"
                  name="insurance_expires_at"
                  value={formData.insurance_expires_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Documents Requis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNI Recto *</label>
                <div className="relative border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    name="id_card_front"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {files.id_card_front ? files.id_card_front.name : 'Choisir un fichier...'}
                    </span>
                  </div>
                </div>
                {errors.id_card_front && <p className="text-red-500 text-xs mt-1">{errors.id_card_front}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNI Verso *</label>
                <div className="relative border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    name="id_card_back"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {files.id_card_back ? files.id_card_back.name : 'Choisir un fichier...'}
                    </span>
                  </div>
                </div>
                {errors.id_card_back && <p className="text-red-500 text-xs mt-1">{errors.id_card_back}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carte Grise</label>
                <div className="relative border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    name="vehicle_registration_card"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {files.vehicle_registration_card ? files.vehicle_registration_card.name : 'Choisir un fichier...'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photos Véhicule</label>
                <div className="relative border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    name="vehicle_photos"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {files.vehicle_photos && files.vehicle_photos.length > 0
                        ? `${files.vehicle_photos.length} fichier(s)`
                        : 'Choisir des photos...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : (transporter ? 'Modifier' : 'Ajouter le transporteur')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
