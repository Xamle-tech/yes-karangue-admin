import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Upload, FileText, Image as ImageIcon, Link } from 'lucide-react';
import { fetchRelayPoints } from '../../services/relayPointService';
import { fetchTransporters } from '../../services/transporterService';

export default function TransporterForm({ transporter, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    full_name: transporter?.name || '',
    phone: transporter?.phone || '',
    vehicle_type: transporter?.transporter_profile?.vehicle_type || 'voiture',
    vehicle_plate: transporter?.transporter_profile?.vehicle_plate || '',
    insurer_name: transporter?.transporter_profile?.insurer_name || '',
    insurance_expires_at: transporter?.transporter_profile?.insurance_expires_at || '',
    station_id: transporter?.transporter_profile?.station_id || '',
    password: transporter ? '' : 'password123',
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Le nom complet est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    if (!formData.vehicle_type) newErrors.vehicle_type = 'Le type de véhicule est requis';
    if (!formData.vehicle_plate) newErrors.vehicle_plate = 'Le numéro de véhicule est requis';

    // For creation, valid station is usually required
    if (!transporter && !formData.station_id) newErrors.station_id = 'Le point (station) est requis';

    // Documents obligatoires à la création
    if (!transporter) {
      if (!files.id_card_front) newErrors.id_card_front = 'La CNI Recto est requise';
      if (!files.id_card_back) newErrors.id_card_back = 'La CNI Verso est requise';
      if (!files.vehicle_registration_card) newErrors.vehicle_registration_card = 'La Carte Grise est requise';
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
      Object.keys(formData).forEach(key => {
        if (key === 'station_id') {
          if (formData.station_id) data.append('station_id', String(Number(formData.station_id)));
        } else {
          data.append(key, formData[key]);
        }
      });

      // Appending files
      if (files.id_card_front) data.append('id_card_front', files.id_card_front);
      if (files.id_card_back) data.append('id_card_back', files.id_card_back);
      if (files.vehicle_registration_card) data.append('vehicle_registration_card', files.vehicle_registration_card);
      if (files.vehicle_photos) {
        if (files.vehicle_photos instanceof FileList) {
          Array.from(files.vehicle_photos).forEach((file) => data.append('vehicle_photos[]', file));
        } else {
          data.append('vehicle_photos[]', files.vehicle_photos);
        }
      }

      // 🐛 DEBUG: Log FormData contents
      console.log('📤 Submitting transporter with FormData:');
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, value.name, `(${value.size} bytes)`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      await onSubmit(data);
    } catch (error) {
      console.error('❌ Erreur soumission transporteur:', error);
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
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      if (name === 'vehicle_photos') {
        setFiles(prev => ({ ...prev, [name]: selectedFiles }));
      } else {
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
      }
    }
  };

  useEffect(() => {
    const loadStations = async () => {
      try {
        setStationsLoading(true);
        const data = await fetchRelayPoints({ limit: 100 });
        const items = Array.isArray(data) ? data : (data.data || []);
        setStations(items);
      } catch (err) {
        console.warn('Erreur chargement stations:', err);
      } finally {
        setStationsLoading(false);
      }
    };
    loadStations();
  }, []);

  const isEditMode = !!transporter;
  const pageTitle = isEditMode ? 'Modifier le transporteur' : 'Ajouter un transporteur';
  const subTitle = isEditMode
    ? `Transporteurs > Transporteur N° ${transporter.id}`
    : 'Transporteurs > Ajouter un transporteur';

  // Colors based on Figma: Edit = Gold/Yellow, Add = Teal/Blue
  const primaryButtonClass = isEditMode
    ? 'bg-[#E8B44D] hover:bg-[#D9A53C]'
    : 'bg-[#305669] hover:bg-[#1F3A4A]';

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-500">{subTitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 pb-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-1">
              {/* Icon placeholder if needed, image shows a simple truck icon or text */}
              <span className="text-xl">🚛</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Informations générales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Row 1 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Nom complet <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Ex: Transport ABC"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:outline-none transition"
              />
              {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Type de véhicule <span className="text-red-500">*</span></label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:outline-none transition bg-white"
              >
                <option value="">Sélectionner</option>
                <option value="moto">Moto</option>
                <option value="voiture">Voiture</option>
                <option value="camion">Camion</option>
                <option value="fourgon">Fourgon</option>
              </select>
              {errors.vehicle_type && <p className="text-red-500 text-xs">{errors.vehicle_type}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Téléphone <span className="text-red-500">*</span></label>
              <div className="flex">
                <div className="bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg px-3 flex items-center gap-2">
                  <span>🇸🇳</span>
                  <span className="text-gray-500 font-medium">+221</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="77 123 45 67"
                  className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:outline-none transition"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* Row 3 - Full Width */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">Numéro de véhicule (Immatriculation) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="vehicle_plate"
                value={formData.vehicle_plate}
                onChange={handleChange}
                placeholder="SN-123-AB"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:outline-none transition"
              />
              {errors.vehicle_plate && <p className="text-red-500 text-xs">{errors.vehicle_plate}</p>}
            </div>

            {/* Extra fields below (Station, Insurance, Files) - keeping them accessible but matching style */}
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Informations complémentaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point de retrait (Station)</label>
                  <select
                    name="station_id"
                    value={formData.station_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none bg-white"
                  >
                    <option value="">Sélectionner un point...</option>
                    {stations.map(s => (
                      <option key={s.id} value={s.id}>{s.name || s.title || `#${s.id}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assurance</label>
                  <input
                    type="date"
                    name="insurance_expires_at"
                    value={formData.insurance_expires_at}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* File Uploads - Condensed */}
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Helper for file inputs */}
                {['id_card_front', 'id_card_back', 'vehicle_registration_card'].map((field) => (
                  <div key={field} className="relative">
                    <div className={`border border-dashed ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'} rounded-lg p-4 text-center transition relative`}>
                      <input
                        type="file"
                        name={field}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className={`h-6 w-6 mx-auto mb-2 ${errors[field] ? 'text-red-400' : 'text-gray-400'}`} />
                      <p className={`text-xs font-medium truncate ${errors[field] ? 'text-red-600' : 'text-gray-600'}`}>
                        {files[field] ? files[field].name : field.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {errors[field] && <p className="text-red-500 text-xs mt-1 text-center">{errors[field]}</p>}
                  </div>
                ))}
                {/* Photos */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative">
                  <input
                    type="file"
                    name="vehicle_photos"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-medium truncate">
                    {files.vehicle_photos ? `${files.vehicle_photos.length} photos` : 'Photos Véhicule'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 text-white rounded-[20px] font-bold text-lg transition shadow-sm disabled:opacity-70 ${primaryButtonClass}`}
            >
              {isSubmitting ? 'Traitement...' : isEditMode ? 'Mettre à jour' : 'Enregistrer'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-[20px] font-bold text-lg hover:bg-gray-50 transition shadow-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
