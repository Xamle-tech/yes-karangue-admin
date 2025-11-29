import { useState } from 'react';
import { X, Upload, ChevronDown } from 'lucide-react';

// 14 régions du Sénégal
const SENEGAL_REGIONS = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Kaolack',
  'Tambacounda',
  'Kolda',
  'Ziguinchor',
  'Sédhiou',
  'Diourbel',
  'Louga',
  'Kaffrine',
  'Matam',
  'Fatick',
  'Tamba',
];

export default function AgentShipmentForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    // Expéditeur
    shipperFirstName: '',
    shipperLastName: '',
    shipperPhone: '',
    
    // Destinataire
    recipientFirstName: '',
    recipientLastName: '',
    recipientPhone: '',
    
    // Colis
    description: '',
    weight: '',
    origin: '',
    destination: '',
    photo: null,
    stampFee: 0,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [originFilter, setOriginFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');

  // Filtrer les régions
  const filteredOrigins = SENEGAL_REGIONS.filter((region) =>
    region.toLowerCase().includes(originFilter.toLowerCase())
  );

  const filteredDestinations = SENEGAL_REGIONS.filter((region) =>
    region.toLowerCase().includes(destinationFilter.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shipperFirstName) newErrors.shipperFirstName = 'Prénom requis';
    if (!formData.shipperLastName) newErrors.shipperLastName = 'Nom requis';
    if (!formData.shipperPhone) newErrors.shipperPhone = 'Téléphone requis';
    if (!formData.recipientFirstName) newErrors.recipientFirstName = 'Prénom requis';
    if (!formData.recipientLastName) newErrors.recipientLastName = 'Nom requis';
    if (!formData.recipientPhone) newErrors.recipientPhone = 'Téléphone requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!formData.weight || formData.weight <= 0)
      newErrors.weight = 'Le poids doit être supérieur à 0';
    if (!formData.origin) newErrors.origin = 'L\'origine est requise';
    if (!formData.destination) newErrors.destination = 'La destination est requise';
    if (!formData.stampFee || formData.stampFee <= 0)
      newErrors.stampFee = 'Le frais de timbre est requis';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        shipper: `${formData.shipperFirstName} ${formData.shipperLastName}`,
        recipient: `${formData.recipientFirstName} ${formData.recipientLastName}`,
      });
    } else {
      setErrors(newErrors);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Enregistrer un nouveau colis
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* EXPÉDITEUR */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4 text-[#305669] uppercase">
              📤 Informations de l'expéditeur
            </h3>
            
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="shipperFirstName"
                  value={formData.shipperFirstName}
                  onChange={handleChange}
                  placeholder="Ahmed"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                />
                {errors.shipperFirstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.shipperFirstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="shipperLastName"
                  value={formData.shipperLastName}
                  onChange={handleChange}
                  placeholder="Diallo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                />
                {errors.shipperLastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.shipperLastName}</p>
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                name="shipperPhone"
                value={formData.shipperPhone}
                onChange={handleChange}
                placeholder="+221 77 123 45 67"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
              />
              {errors.shipperPhone && (
                <p className="text-red-600 text-sm mt-1">{errors.shipperPhone}</p>
              )}
            </div>
          </div>

          {/* DESTINATAIRE */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4 text-[#305669] uppercase">
              📥 Informations du destinataire
            </h3>
            
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="recipientFirstName"
                  value={formData.recipientFirstName}
                  onChange={handleChange}
                  placeholder="Fatou"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                />
                {errors.recipientFirstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.recipientFirstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="recipientLastName"
                  value={formData.recipientLastName}
                  onChange={handleChange}
                  placeholder="Sall"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                />
                {errors.recipientLastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.recipientLastName}</p>
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={handleChange}
                placeholder="+221 77 987 65 43"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
              />
              {errors.recipientPhone && (
                <p className="text-red-600 text-sm mt-1">{errors.recipientPhone}</p>
              )}
            </div>
          </div>

          {/* DÉTAILS DU COLIS */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4 text-[#305669] uppercase">
              📦 Détails du colis
            </h3>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Description du colis *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Colis électronique, Documents, Vêtements..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition resize-none"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Poids */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Poids (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="2.5"
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                />
                {errors.weight && (
                  <p className="text-red-600 text-sm mt-1">{errors.weight}</p>
                )}
              </div>
            </div>

            {/* Origine & Destination - Dropdowns avec Autocomplétion */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Origine */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Région d'origine *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOriginOpen(!originOpen);
                    setDestinationOpen(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white focus:ring-2 focus:ring-[#305669] focus:border-transparent transition text-left"
                >
                  <span className={formData.origin ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.origin || 'Sélectionner une région'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition ${originOpen ? 'rotate-180' : ''}`} />
                </button>

                {originOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <input
                      type="text"
                      placeholder="Chercher une région..."
                      value={originFilter}
                      onChange={(e) => setOriginFilter(e.target.value)}
                      className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none text-sm"
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {filteredOrigins.length > 0 ? (
                        filteredOrigins.map((region) => (
                          <button
                            key={region}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, origin: region }));
                              setOriginOpen(false);
                              setOriginFilter('');
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-[#305669] hover:text-white transition text-sm ${
                              formData.origin === region ? 'bg-[#305669] text-white' : ''
                            }`}
                          >
                            {region}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-2.5 text-gray-500 text-sm">Aucune région trouvée</p>
                      )}
                    </div>
                  </div>
                )}

                {errors.origin && (
                  <p className="text-red-600 text-sm mt-1">{errors.origin}</p>
                )}
              </div>

              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Région de destination *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDestinationOpen(!destinationOpen);
                    setOriginOpen(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white focus:ring-2 focus:ring-[#305669] focus:border-transparent transition text-left"
                >
                  <span className={formData.destination ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.destination || 'Sélectionner une région'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition ${destinationOpen ? 'rotate-180' : ''}`} />
                </button>

                {destinationOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <input
                      type="text"
                      placeholder="Chercher une région..."
                      value={destinationFilter}
                      onChange={(e) => setDestinationFilter(e.target.value)}
                      className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none text-sm"
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {filteredDestinations.length > 0 ? (
                        filteredDestinations.map((region) => (
                          <button
                            key={region}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, destination: region }));
                              setDestinationOpen(false);
                              setDestinationFilter('');
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-[#305669] hover:text-white transition text-sm ${
                              formData.destination === region ? 'bg-[#305669] text-white' : ''
                            }`}
                          >
                            {region}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-2.5 text-gray-500 text-sm">Aucune région trouvée</p>
                      )}
                    </div>
                  </div>
                )}

                {errors.destination && (
                  <p className="text-red-600 text-sm mt-1">{errors.destination}</p>
                )}
              </div>
            </div>

            {/* Frais de timbre */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Frais de timbre (FCFA) *
              </label>
              <input
                type="number"
                name="stampFee"
                value={formData.stampFee}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
              />
              {errors.stampFee && (
                <p className="text-red-600 text-sm mt-1">{errors.stampFee}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Le paiement sera confirmé automatiquement
              </p>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Photo du colis (optionnel)
              </label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Aperçu"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData((prev) => ({ ...prev, photo: null }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Cliquez pour ajouter une photo
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>ℹ️ Information:</strong> Le colis sera enregistré avec le statut
              "Dépôt". Vous pourrez ensuite mettre à jour son statut jusqu'à l'étape 3
              (En cours de livraison).
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition"
            >
              Enregistrer le colis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
