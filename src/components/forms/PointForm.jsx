import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, User, Clock, ChevronDown } from 'lucide-react';
import { fetchRelayPointTypes } from '../../services/relayPointService';
import { fetchUsers } from '../../services/userService';

export default function PointForm({ point, onSubmit, onCancel }) {
    const isEditMode = !!point;

    // Initial State
    const [formData, setFormData] = useState({
        name: point?.name || '',
        address: point?.address || '',
        type: point?.type || 'DEPOT_RETRAIT',
        main_phone: point?.main_phone || point?.phone || '',
        manager_user_id: point?.manager_user_id || '',
        // Additional Manager Info for display or secondary/separate saving if API requires
        manager_name: point?.manager || '',
        manager_phone: point?.managerPhone || '',

        is_active: point?.is_active !== undefined ? point.is_active : true,
        // Hours not currently in basic schema but placeholder for UI
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);
    const [typeOptions, setTypeOptions] = useState([
        { value: 'DEPOT', label: 'Dépôt uniquement' },
        { value: 'RETRAIT', label: 'Retrait uniquement' },
        { value: 'DEPOT_RETRAIT', label: 'Dépôt et Retrait' },
    ]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    // Charger les types de points relais et les managers depuis l'API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingTypes(true);
                setLoadingManagers(true);

                // Charger les types
                const types = await fetchRelayPointTypes();
                if (types && types.length > 0) {
                    setTypeOptions(types);
                }

                // Charger les utilisateurs (managers)
                // "charger la liste des utilisateurs (ensuite on filtre les admin)"
                const usersResponse = await fetchUsers({ limit: 100 });
                const usersList = Array.isArray(usersResponse) ? usersResponse : (usersResponse.data || []);

                // Filtrer les admins (qui seront les gestionnaires)
                const admins = usersList.filter(user =>
                    user.role === 'ADMIN' ||
                    user.role === 'admin' ||
                    user.role === 'SUPER_ADMIN' ||
                    user.role === 'super_admin'
                );
                setManagers(admins);

            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoadingTypes(false);
                setLoadingManagers(false);
            }
        };

        loadData();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Le nom est requis';
        if (!formData.address) newErrors.address = 'L\'adresse est requise';
        if (!formData.type) newErrors.type = 'Le type est requis';
        if (!formData.main_phone) newErrors.main_phone = 'Le téléphone est requis';

        // Gestionnaire
        if (!formData.manager_user_id) newErrors.manager_user_id = 'Le gestionnaire est requis';
        // Validation format manager_user_id (usr_XX) - REMOVED as we select from list now
        /*
        if (formData.manager_user_id && !formData.manager_user_id.match(/^usr_[0-9]+$/)) {
            newErrors.manager_user_id = 'Format invalide (ex: usr_55)';
        }
        */

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-fill phone/name when manager is selected
        if (name === 'manager_user_id') {
            const selectedManager = managers.find(m => String(m.id) === String(value));
            if (selectedManager) {
                setFormData(prev => ({
                    ...prev,
                    manager_name: (selectedManager.name || selectedManager.full_name || selectedManager.email || '').trim(),
                    manager_phone: selectedManager.phone || '',
                    manager_user_id: value
                }));
            } else {
                // Clear manager info if no manager is selected (e.g., "Sélectionner")
                setFormData(prev => ({
                    ...prev,
                    manager_name: '',
                    manager_phone: '',
                    manager_user_id: value
                }));
            }
        }

        if (errors[name]) {
            setErrors((prev) => {
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
            // Scroll to top to see errors if needed
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Erreur soumission:', error);
            setErrors({ submit: error.message || 'Une erreur est survenue' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Breadcrumbs */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="cursor-pointer hover:text-gray-700" onClick={onCancel}>Points de Retrait</span>
                    <span>{'>'}</span>
                    <span className="text-gray-900 font-medium">
                        {isEditMode ? `Point N° ${point.id || '...'}` : 'Ajouter un nouveau point'}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditMode ? formData.name : 'Ajouter un nouveau point'}
                        </h1>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        {errors.submit}
                    </div>
                )}

                {/* Informations générales */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="h-5 w-5 text-[#305669]" />
                        <h2 className="text-lg font-bold text-gray-900">Informations générales</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nom du point */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Nom du point <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Point Dakar Centre"
                                className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition
                                    ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>

                        {/* Type de point */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Type de point <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition cursor-pointer"
                                    disabled={loadingTypes}
                                >
                                    {loadingTypes ? (
                                        <option>Chargement...</option>
                                    ) : (
                                        <>
                                            <option value="">Sélectionner</option>
                                            {typeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                        </div>

                        {/* Email / Adresse (Reusing Address for layout as per image) */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            {/* Note: 'email' is not in initial formData/schema, using placeholder input or mapped to a field if exists. 
                                 Based on previous schema it wasn't there, assuming 'email' might be needed or is 'contact'
                                 The Form image shows 'Email' but code had `main_phone`. I'll add an email field to state if needed, 
                                 but for now let's stick to existing props or add a dummy if backend doesn't support it yet.
                                 I'll add it to UI but it might not save if backend doesn't expect it.
                              */}
                            <input
                                type="email"
                                name="email" // Warning: Ensure backend supports this
                                value={formData.email || ''}
                                onChange={handleChange}
                                placeholder="Ex: dakar-centre@yeskarangue.com"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition"
                            />
                        </div>

                        {/* Adresse complète */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Adresse complète <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ex: Dakar, Point E"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition
                                        ${errors.address ? 'border-red-300' : 'border-gray-200'}`}
                                />
                            </div>
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                        </div>

                        {/* Téléphone principal */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Téléphone principal <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <div className="flex items-center justify-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50">
                                    <span role="img" aria-label="Senegal">🇸🇳</span>
                                    <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
                                </div>
                                <input
                                    type="tel"
                                    name="main_phone"
                                    value={formData.main_phone}
                                    onChange={handleChange}
                                    placeholder="+221 77 123 45 67"
                                    className={`w-full px-4 py-2.5 bg-white border rounded-r-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition
                                        ${errors.main_phone ? 'border-red-300' : 'border-gray-200'}`}
                                />
                            </div>
                            {errors.main_phone && <p className="text-red-500 text-xs">{errors.main_phone}</p>}
                        </div>

                    </div>
                </div>

                {/* Gestionnaire */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="h-5 w-5 text-[#305669]" />
                        <h2 className="text-lg font-bold text-gray-900">Gestionnaire</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nom du gestionnaire (Display only or mapping to ID?) 
                             The form requires ID 'usr_...'. 
                             I'll keep the ID input but label it clearly or maybe split inputs if the design implies entering a name creates a user? 
                             The design shows 'Nom du gestionnaire' and 'Téléphone gestionnaire'.
                             Currently the backend expects 'manager_user_id'. 
                             I will keep the ID input for functionality but style it as per design, maybe adding a helper.
                         */}

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Gestionnaire <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="manager_user_id"
                                    value={formData.manager_user_id}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-lg appearance-none focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition cursor-pointer
                                        ${errors.manager_user_id ? 'border-red-300' : 'border-gray-200'}`}
                                    disabled={loadingManagers}
                                >
                                    <option value="">Sélectionner un gestionnaire</option>
                                    {loadingManagers ? (
                                        <option disabled>Chargement...</option>
                                    ) : (
                                        managers.map((manager) => (
                                            <option key={manager.id} value={manager.id}>
                                                {manager.name || manager.full_name || manager.email} {manager.email && (manager.name || manager.full_name) ? `(${manager.email})` : ''}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.manager_user_id && <p className="text-red-500 text-xs">{errors.manager_user_id}</p>}
                        </div>

                        {/* Téléphone gestionnaire (Facultatif / Visuel) */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Téléphone gestionnaire <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <div className="flex items-center justify-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50">
                                    <span role="img" aria-label="Senegal">🇸🇳</span>
                                    <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
                                </div>
                                <input
                                    type="tel"
                                    name="manager_phone" // This is purely visual if backend doesn't take it
                                    value={formData.manager_phone}
                                    onChange={handleChange}
                                    placeholder="+221 77 123 45 67"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#E8B44D]/20 focus:border-[#E8B44D] outline-none transition"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Horaires d'ouverture (Only in Edit Mode usually, or if Design shows it always) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="h-5 w-5 text-[#305669]" />
                        <h2 className="text-lg font-bold text-gray-900">Horaires d'ouverture</h2>
                    </div>
                    {/* Placeholder for Hours Editor - assuming read-only or simple inputs for now as per Image 2 (it just shows the section header in Image 2 really) */}
                    <p className="text-sm text-gray-500 italic">Configuration des horaires (À implémenter selon le format des données)</p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#264554] transition disabled:opacity-70 flex items-center gap-2"
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

