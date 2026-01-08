import { useState, useEffect } from 'react';
import { X, Upload, Search, Check, User, MapPin, Package, Truck, ArrowLeft } from 'lucide-react';
import { fetchTransporters } from '../../services/transporterService';

export default function ShipmentForm({ shipment, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    // Expéditeur
    sender_first_name: '',
    sender_last_name: '',
    sender_phone: '',
    sender_address: '',
    sender_id_type: 'CNI',
    sender_id_number: '',

    // Destinataire
    recipient_first_name: '',
    recipient_last_name: '',
    recipient_phone: '',
    recipient_address: '',

    // Colis
    description: '',
    weight: '',
    stamp_fee: '',

    // Transporteur
    transporter_id: '',
  });

  const [files, setFiles] = useState({
    sender_id_front: null,
    sender_id_back: null,
    package_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [transporters, setTransporters] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [transporterSearch, setTransporterSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les transporteurs
  useEffect(() => {
    const loadTransporters = async () => {
      try {
        setLoadingTransporters(true);
        const data = await fetchTransporters({ limit: 100 });
        const items = Array.isArray(data) ? data : (data.data || []);
        setTransporters(items);
      } catch (err) {
        console.error('Erreur chargement transporteurs:', err);
      } finally {
        setLoadingTransporters(false);
      }
    };
    loadTransporters();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    // Expéditeur
    if (!formData.sender_first_name) newErrors.sender_first_name = 'Prénom requis';
    if (!formData.sender_last_name) newErrors.sender_last_name = 'Nom requis';
    if (!formData.sender_phone) newErrors.sender_phone = 'Téléphone requis';
    if (!formData.sender_address) newErrors.sender_address = 'Adresse requise';
    if (!formData.sender_id_number) newErrors.sender_id_number = 'Numéro d\'identité requis';

    // Destinataire
    if (!formData.recipient_first_name) newErrors.recipient_first_name = 'Prénom requis';
    if (!formData.recipient_last_name) newErrors.recipient_last_name = 'Nom requis';
    if (!formData.recipient_phone) newErrors.recipient_phone = 'Téléphone requis';
    if (!formData.recipient_address) newErrors.recipient_address = 'Adresse requise';

    // Colis
    if (!formData.description) newErrors.description = 'Description requise';
    if (!formData.weight) newErrors.weight = 'Poids requis';
    if (!formData.stamp_fee) newErrors.stamp_fee = 'Frais de timbre requis';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top or first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        sender_full_name: `${formData.sender_first_name} ${formData.sender_last_name}`,
        recipient_full_name: `${formData.recipient_first_name} ${formData.recipient_last_name}`,
        ...files
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const filteredTransporters = transporters.filter(t =>
    (t.name || '').toLowerCase().includes(transporterSearch.toLowerCase()) ||
    (t.phone || '').includes(transporterSearch)
  );

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto flex flex-col">
      {/* Header Full Width */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ajouter un colis</h1>
            <p className="text-sm text-gray-500">Colis {'>'} Ajouter un colis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition hidden md:block"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#E8B44D] text-white rounded-lg font-medium hover:bg-[#D9A53C] transition shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : 'Enregistrer le colis'}
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">

        {/* Expéditeur */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Expéditeur</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                name="sender_first_name"
                value={formData.sender_first_name}
                onChange={handleChange}
                placeholder="Ex: Abou"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.sender_first_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.sender_first_name && <p className="text-red-500 text-xs mt-1">{errors.sender_first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                name="sender_last_name"
                value={formData.sender_last_name}
                onChange={handleChange}
                placeholder="Ex: Diallo"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.sender_last_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.sender_last_name && <p className="text-red-500 text-xs mt-1">{errors.sender_last_name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <div className="flex">
                <div className="bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg px-3 flex items-center gap-2">
                  <span className="text-lg">🇸🇳</span>
                  <span className="text-gray-500 text-sm font-medium">+221</span>
                </div>
                <input
                  type="tel"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleChange}
                  placeholder="77 123 45 67"
                  className={`w-full px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.sender_phone ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.sender_phone && <p className="text-red-500 text-xs mt-1">{errors.sender_phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de l'expéditeur *</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleChange}
                  placeholder="Ex: Dakar, Point E"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.sender_address ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.sender_address && <p className="text-red-500 text-xs mt-1">{errors.sender_address}</p>}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de pièce *</label>
              <select
                name="sender_id_type"
                value={formData.sender_id_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none"
              >
                <option value="CNI">CNI</option>
                <option value="PASSPORT">Passeport</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'identité *</label>
              <input
                type="text"
                name="sender_id_number"
                value={formData.sender_id_number}
                onChange={handleChange}
                placeholder="1 904 1999 00516"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.sender_id_number ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.sender_id_number && <p className="text-red-500 text-xs mt-1">{errors.sender_id_number}</p>}
            </div>

            {/* CNI Photos */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">CNI recto</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer relative group bg-gray-50/50">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={(e) => handleFileChange(e, 'sender_id_front')}
                  accept="image/*"
                />
                <div className="text-center">
                  {files.sender_id_front ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-green-600 font-medium">
                      <Check className="h-8 w-8 bg-green-100 p-1.5 rounded-full" />
                      <span className="text-sm truncate max-w-[200px]">{files.sender_id_front.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-[#FEF9E8] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-5 w-5 text-[#E8B44D]" />
                      </div>
                      <div className="text-sm font-medium text-[#E8B44D] mb-1">Choisir un fichier</div>
                      <p className="text-gray-500 text-xs">ou glisser-déposer</p>
                      <p className="text-gray-400 text-[10px] mt-1">PNG, JPG jusqu'à 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">CNI verso</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer relative group bg-gray-50/50">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={(e) => handleFileChange(e, 'sender_id_back')}
                  accept="image/*"
                />
                <div className="text-center">
                  {files.sender_id_back ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-green-600 font-medium">
                      <Check className="h-8 w-8 bg-green-100 p-1.5 rounded-full" />
                      <span className="text-sm truncate max-w-[200px]">{files.sender_id_back.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-[#FEF9E8] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-5 w-5 text-[#E8B44D]" />
                      </div>
                      <div className="text-sm font-medium text-[#E8B44D] mb-1">Choisir un fichier</div>
                      <p className="text-gray-500 text-xs">ou glisser-déposer</p>
                      <p className="text-gray-400 text-[10px] mt-1">PNG, JPG jusqu'à 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destinataire */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Destinataire</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                name="recipient_first_name"
                value={formData.recipient_first_name}
                onChange={handleChange}
                placeholder="Ex: Abou"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.recipient_first_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.recipient_first_name && <p className="text-red-500 text-xs mt-1">{errors.recipient_first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                name="recipient_last_name"
                value={formData.recipient_last_name}
                onChange={handleChange}
                placeholder="Ex: Diallo"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.recipient_last_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.recipient_last_name && <p className="text-red-500 text-xs mt-1">{errors.recipient_last_name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <div className="flex">
                <div className="bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg px-3 flex items-center gap-2">
                  <span className="text-lg">🇸🇳</span>
                  <span className="text-gray-500 text-sm font-medium">+221</span>
                </div>
                <input
                  type="tel"
                  name="recipient_phone"
                  value={formData.recipient_phone}
                  onChange={handleChange}
                  placeholder="77 123 45 67"
                  className={`w-full px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.recipient_phone ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.recipient_phone && <p className="text-red-500 text-xs mt-1">{errors.recipient_phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse du destinataire *</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="recipient_address"
                  value={formData.recipient_address}
                  onChange={handleChange}
                  placeholder="Ex: Dakar, Point E"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.recipient_address ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.recipient_address && <p className="text-red-500 text-xs mt-1">{errors.recipient_address}</p>}
            </div>
          </div>
        </div>

        {/* Détails du Colis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Détails du Colis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description du contenu *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Colis électronique"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Ex: 25"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frais de timbre (FCFA) *</label>
              <input
                type="number"
                name="stamp_fee"
                value={formData.stamp_fee}
                onChange={handleChange}
                placeholder="Ex: 500"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none ${errors.stamp_fee ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stamp_fee && <p className="text-red-500 text-xs mt-1">{errors.stamp_fee}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo du colis</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer relative group bg-gray-50/50">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={(e) => handleFileChange(e, 'package_photo')}
                  accept="image/*"
                />
                <div className="text-center">
                  {files.package_photo ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-green-600 font-medium">
                      <Check className="h-8 w-8 bg-green-100 p-1.5 rounded-full" />
                      <span className="text-sm truncate max-w-[200px]">{files.package_photo.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-[#FEF9E8] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-5 w-5 text-[#E8B44D]" />
                      </div>
                      <div className="text-sm font-medium text-[#E8B44D] mb-1">Choisir un fichier</div>
                      <p className="text-gray-500 text-xs">ou glisser-déposer</p>
                      <p className="text-gray-400 text-[10px] mt-1">PNG, JPG jusqu'à 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sélection du Transporteur */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Sélection du Transporteur</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transporteur *</label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Choisir un transporteur"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] transition outline-none"
                value={transporterSearch}
                onChange={(e) => setTransporterSearch(e.target.value)}
              />
            </div>

            {/* Liste des transporteurs filtrés */}
            {transporterSearch && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                {loadingTransporters && <div className="p-3 text-sm text-gray-500">Chargement...</div>}

                {!loadingTransporters && filteredTransporters.map(t => (
                  <div
                    key={t.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center ${formData.transporter_id === t.id ? 'bg-[#FEF9E8] border-l-4 border-[#E8B44D]' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, transporter_id: t.id }));
                      setTransporterSearch(t.name);
                    }}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.phone}</p>
                    </div>
                    {formData.transporter_id === t.id && <Check className="h-5 w-5 text-[#E8B44D]" />}
                  </div>
                ))}

                {!loadingTransporters && filteredTransporters.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">Aucun transporteur trouvé</div>
                )}
              </div>
            )}

            {/* Si un transporteur est sélectionné mais qu'on a effacé la recherche, on peut afficher le transporteur sélectionné ou juste laisser la recherche */}
            {formData.transporter_id && !transporterSearch && (() => {
              const selected = transporters.find(t => t.id === formData.transporter_id);
              return selected ? (
                <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-lg flex justify-between items-center">
                  <span className="font-medium">Transporteur sélectionné : {selected.name}</span>
                  <button onClick={() => setFormData(prev => ({ ...prev, transporter_id: '' }))} className="text-blue-600 hover:text-blue-800"><X className="h-4 w-4" /></button>
                </div>
              ) : null;
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}
