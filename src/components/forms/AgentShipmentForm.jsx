import { useState, useEffect } from 'react';
import { X, User, MapPin, Package as PackageIcon, Truck, Upload as UploadIcon, Search } from 'lucide-react';
import { fetchTransporters } from '../../services/transporterService';

const ID_TYPES = ['CNI', 'Passeport', 'Carte consulaire'];

export default function AgentShipmentForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    // Expéditeur
    sender_first_name: '',
    sender_last_name: '',
    sender_phone: '',
    sender_address: '',
    sender_id_type: 'CNI',
    sender_id_number: '',
    sender_id_front: null,
    sender_id_back: null,

    // Destinataire
    recipient_first_name: '',
    recipient_last_name: '',
    recipient_phone: '',
    recipient_address: '',

    // Détails du colis
    content_description: '',
    weight_kg: '',
    stamp_fee_fcfa: '',
    package_photo: null,

    // Transporteur
    transporter_id: '',
  });

  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({
    sender_id_front: null,
    sender_id_back: null,
    package_photo: null,
  });
  const [transporters, setTransporters] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(false);

  useEffect(() => {
    const loadTransporters = async () => {
      try {
        setLoadingTransporters(true);
        // Utiliser la limite de 200 comme demandé
        const response = await fetchTransporters({ limit: 200, offset: 0 });
        const transportersList = Array.isArray(response) ? response : (response.data || []);
        setTransporters(transportersList);
      } catch (error) {
        console.error('Erreur lors du chargement des transporteurs:', error);
      } finally {
        setLoadingTransporters(false);
      }
    };

    loadTransporters();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Expéditeur
    if (!formData.sender_first_name) newErrors.sender_first_name = 'Prénom requis';
    if (!formData.sender_last_name) newErrors.sender_last_name = 'Nom requis';
    if (!formData.sender_phone) newErrors.sender_phone = 'Téléphone requis';
    if (!formData.sender_address) newErrors.sender_address = 'Adresse requise';
    if (!formData.sender_id_type) newErrors.sender_id_type = 'Type de pièce requis';
    if (!formData.sender_id_number) newErrors.sender_id_number = 'Numéro d\'identité requis';

    // Destinataire
    if (!formData.recipient_first_name) newErrors.recipient_first_name = 'Prénom requis';
    if (!formData.recipient_last_name) newErrors.recipient_last_name = 'Nom requis';
    if (!formData.recipient_phone) newErrors.recipient_phone = 'Téléphone requis';
    if (!formData.recipient_address) newErrors.recipient_address = 'Adresse requise';

    // Détails du colis
    if (!formData.content_description) newErrors.content_description = 'Description requise';
    if (!formData.weight_kg || formData.weight_kg <= 0) newErrors.weight_kg = 'Poids invalide';
    if (!formData.stamp_fee_fcfa || formData.stamp_fee_fcfa <= 0) newErrors.stamp_fee_fcfa = 'Frais de timbre requis';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // Créer un FormData pour envoyer les fichiers
      const submitData = new FormData();

      // Concaténer les noms pour l'API
      const sender_full_name = `${formData.sender_first_name} ${formData.sender_last_name}`.trim();
      const recipient_full_name = `${formData.recipient_first_name} ${formData.recipient_last_name}`.trim();

      // Ajouter les champs requis par l'API
      submitData.append('sender_full_name', sender_full_name);
      submitData.append('sender_phone', formData.sender_phone);
      submitData.append('sender_address', formData.sender_address);
      if (formData.sender_id_type) submitData.append('sender_id_type', formData.sender_id_type);
      if (formData.sender_id_number) submitData.append('sender_id_number', formData.sender_id_number);
      if (formData.sender_id_front) submitData.append('sender_id_front', formData.sender_id_front);
      if (formData.sender_id_back) submitData.append('sender_id_back', formData.sender_id_back);

      submitData.append('recipient_full_name', recipient_full_name);
      submitData.append('recipient_phone', formData.recipient_phone);
      submitData.append('recipient_address', formData.recipient_address);

      submitData.append('content_description', formData.content_description);
      submitData.append('weight_kg', formData.weight_kg);
      if (formData.stamp_fee_fcfa) submitData.append('stamp_fee_fcfa', formData.stamp_fee_fcfa);
      if (formData.package_photo) submitData.append('package_photo', formData.package_photo);
      if (formData.transporter_id) submitData.append('transporter_id', formData.transporter_id);

      onSubmit(submitData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B9BAD] rounded-lg flex items-center justify-center">
              <PackageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-0.5">
                <span>Gestion des Colis</span>
                <span>›</span>
                <span>Enregistrer un nouveau colis</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Enregistrer un nouveau colis</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-6">
            {/* EXPÉDITEUR */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-[#5B9BAD]" />
                <h3 className="text-base font-semibold text-gray-900">Expéditeur</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sender_first_name"
                    value={formData.sender_first_name}
                    onChange={handleChange}
                    placeholder="Ex: Abou"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                  />
                  {errors.sender_first_name && (
                    <p className="text-red-600 text-xs mt-1">{errors.sender_first_name}</p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sender_last_name"
                    value={formData.sender_last_name}
                    onChange={handleChange}
                    placeholder="Ex: Diallo"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                  />
                  {errors.sender_last_name && (
                    <p className="text-red-600 text-xs mt-1">{errors.sender_last_name}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg bg-white">
                      <span className="text-lg">🇸🇳</span>
                      <span className="text-sm text-gray-700">+221</span>
                    </div>
                    <input
                      type="tel"
                      name="sender_phone"
                      value={formData.sender_phone}
                      onChange={handleChange}
                      placeholder="77 123 45 67"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                    />
                  </div>
                  {errors.sender_phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.sender_phone}</p>
                  )}
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de l'expéditeur <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="sender_address"
                      value={formData.sender_address}
                      onChange={handleChange}
                      placeholder="Ex: Dakar, Point E"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                    />
                  </div>
                  {errors.sender_address && (
                    <p className="text-red-600 text-xs mt-1">{errors.sender_address}</p>
                  )}
                </div>

                {/* Type de pièce */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de pièce <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sender_id_type"
                    value={formData.sender_id_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition bg-white text-sm"
                  >
                    {ID_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.sender_id_type && (
                    <p className="text-red-600 text-xs mt-1">{errors.sender_id_type}</p>
                  )}
                </div>

                {/* Numéro d'identité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro d'identité <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sender_id_number"
                    value={formData.sender_id_number}
                    onChange={handleChange}
                    placeholder="1 904 1999 00516"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                  />
                  {errors.sender_id_number && (
                    <p className="text-red-600 text-xs mt-1">{errors.sender_id_number}</p>
                  )}
                </div>

                {/* CNI recto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNI recto</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    {previews.sender_id_front ? (
                      <div className="relative">
                        <img src={previews.sender_id_front} alt="CNI recto" className="w-full h-24 object-cover rounded" />
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'sender_id_front')}
                          className="hidden"
                        />
                        <UploadIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-[#E8B44D] text-white rounded-lg text-xs font-medium hover:bg-[#D9A53C] transition"
                          onClick={(e) => {
                            e.preventDefault();
                            e.currentTarget.parentElement.querySelector('input[type="file"]').click();
                          }}
                        >
                          Choisir un fichier
                        </button>
                        <span className="text-gray-600 text-xs mx-2">ou glisser-déposer</span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                      </label>
                    )}
                  </div>
                </div>

                {/* CNI verso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNI verso</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    {previews.sender_id_back ? (
                      <div className="relative">
                        <img src={previews.sender_id_back} alt="CNI verso" className="w-full h-24 object-cover rounded" />
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'sender_id_back')}
                          className="hidden"
                        />
                        <UploadIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-[#E8B44D] text-white rounded-lg text-xs font-medium hover:bg-[#D9A53C] transition"
                          onClick={(e) => {
                            e.preventDefault();
                            e.currentTarget.parentElement.querySelector('input[type="file"]').click();
                          }}
                        >
                          Choisir un fichier
                        </button>
                        <span className="text-gray-600 text-xs mx-2">ou glisser-déposer</span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DESTINATAIRE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-[#5B9BAD]" />
                <h3 className="text-base font-semibold text-gray-900">Destinataire</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipient_first_name"
                    value={formData.recipient_first_name}
                    onChange={handleChange}
                    placeholder="Ex: Abou"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                  />
                  {errors.recipient_first_name && (
                    <p className="text-red-600 text-xs mt-1">{errors.recipient_first_name}</p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipient_last_name"
                    value={formData.recipient_last_name}
                    onChange={handleChange}
                    placeholder="Ex: Diallo"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                  />
                  {errors.recipient_last_name && (
                    <p className="text-red-600 text-xs mt-1">{errors.recipient_last_name}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg bg-white">
                      <span className="text-lg">🇸🇳</span>
                      <span className="text-sm text-gray-700">+221</span>
                    </div>
                    <input
                      type="tel"
                      name="recipient_phone"
                      value={formData.recipient_phone}
                      onChange={handleChange}
                      placeholder="77 123 45 67"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                    />
                  </div>
                  {errors.recipient_phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.recipient_phone}</p>
                  )}
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse du destinataire <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="recipient_address"
                      value={formData.recipient_address}
                      onChange={handleChange}
                      placeholder="Ex: Dakar, Point E"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                    />
                  </div>
                  {errors.recipient_address && (
                    <p className="text-red-600 text-xs mt-1">{errors.recipient_address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* DÉTAILS DU COLIS */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <PackageIcon className="h-5 w-5 text-[#5B9BAD]" />
                <h3 className="text-base font-semibold text-gray-900">Détails du Colis</h3>
              </div>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description du contenu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="content_description"
                    value={formData.content_description}
                    onChange={handleChange}
                    placeholder="Ex: Colis électronique"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                  />
                  {errors.content_description && (
                    <p className="text-red-600 text-xs mt-1">{errors.content_description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Poids */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleChange}
                      placeholder="Ex: 25"
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                    />
                    {errors.weight_kg && (
                      <p className="text-red-600 text-xs mt-1">{errors.weight_kg}</p>
                    )}
                  </div>

                  {/* Frais de timbre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais de timbre (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stamp_fee_fcfa"
                      value={formData.stamp_fee_fcfa}
                      onChange={handleChange}
                      placeholder="Ex: 500"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition text-sm"
                    />
                    {errors.stamp_fee_fcfa && (
                      <p className="text-red-600 text-xs mt-1">{errors.stamp_fee_fcfa}</p>
                    )}
                  </div>
                </div>

                {/* Photo du colis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo du colis</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    {previews.package_photo ? (
                      <div className="relative">
                        <img src={previews.package_photo} alt="Colis" className="w-full h-32 object-cover rounded" />
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'package_photo')}
                          className="hidden"
                        />
                        <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 bg-[#E8B44D] text-white rounded-lg text-sm font-medium hover:bg-[#D9A53C] transition"
                          onClick={(e) => {
                            e.preventDefault();
                            e.currentTarget.parentElement.querySelector('input[type="file"]').click();
                          }}
                        >
                          Choisir un fichier
                        </button>
                        <span className="text-gray-600 text-sm mx-2">ou glisser-déposer</span>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SÉLECTION DU TRANSPORTEUR */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-[#5B9BAD]" />
                <h3 className="text-base font-semibold text-gray-900">Sélection du Transporteur</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transporteur
                </label>
                <div className="relative">
                  <select
                    name="transporter_id"
                    value={formData.transporter_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent transition bg-white text-sm"
                    disabled={loadingTransporters}
                  >
                    <option value="">
                      {loadingTransporters ? 'Chargement...' : 'Choisir un transporteur'}
                    </option>
                    {transporters.map(transporter => (
                      <option key={transporter.id} value={transporter.id}>
                        {transporter.name || transporter.company_name} - {transporter.vehicle_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#5B9BAD] text-white rounded-lg font-semibold hover:bg-[#4A8999] transition shadow-sm text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  'Générer la lettre de route'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
