import { useState, useEffect } from 'react';
import { X, Upload, Search, Check, User, MapPin, Package, Truck, ArrowLeft, Printer } from 'lucide-react';
import { fetchTransporters } from '../../services/transporterService';

export default function ShipmentForm({ shipment, transporters: initialTransporters, onSubmit, onClose }) {
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
  const [transporterSearch, setTransporterSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use passed transporters
  const transporters = initialTransporters || [];

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
    <div className="bg-gray-50 min-h-screen flex flex-col">
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
          {/* Header actions can remain for UX or be removed if strict match required. Keeping minimal 'X' or similar is good. */}
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
            <Truck className="h-5 w-5 text-[#14988B]" />
            <h2 className="text-lg font-bold text-gray-900">Sélection du Transporteur</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transporteur</label>
            <select
              value={formData.transporter_id}
              onChange={(e) => setFormData(prev => ({ ...prev, transporter_id: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14988B]/20 focus:border-[#14988B] transition outline-none bg-white appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="">Choisir un transporteur</option>
              {transporters.map(t => (
                <option key={t.id} value={t.id}>{t.name} {t.phone ? `(${t.phone})` : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons Section matching image */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-[#14988B] text-white rounded-lg font-bold text-lg hover:bg-[#118276] transition shadow-sm disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? 'Traitement...' : 'Générer la lettre de route'}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
        </div>

      </div>
    </div>
  );
}
