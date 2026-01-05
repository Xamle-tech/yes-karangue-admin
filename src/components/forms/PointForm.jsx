import { useState } from 'react';
import { X } from 'lucide-react';

export default function PointForm({ point, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        name: point?.name || '',
        address: point?.address || '',
        type: point?.type || 'DEPOT_RETRAIT',
        north_phone: point?.north_phone || point?.phone || '',
        manager_user_id: point?.manager_user_id || '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const typeOptions = [
        { value: 'DEPOT', label: 'Dépôt' },
        { value: 'RETRAIT', label: 'Retrait' },
        { value: 'DEPOT_RETRAIT', label: 'Dépôt et Retrait' },
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Le nom est requis';
        if (!formData.address) newErrors.address = 'L\'adresse est requise';
        if (!formData.type) newErrors.type = 'Le type est requis';
        if (!formData.north_phone) newErrors.north_phone = 'Le téléphone est requis';
        if (!formData.manager_user_id) newErrors.manager_user_id = 'L\'ID du gestionnaire est requis';

        // Validation format manager_user_id (usr_XX)
        if (formData.manager_user_id && !formData.manager_user_id.match(/^usr_[0-9]+$/)) {
            newErrors.manager_user_id = 'Format invalide (ex: usr_55)';
        }

        return newErrors;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Erreur soumission:', error);
            setErrors({ submit: error.message || 'Une erreur est survenue' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {point ? 'Modifier le point' : 'Ajouter un point de retrait'}
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {errors.submit}
                        </div>
                    )}

                    {/* Nom du point */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du point *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Point Relais Dakar Centre"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D] focus:border-[#E8B44D] focus:outline-none"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Adresse */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Avenue Bourguiba, Dakar"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D] focus:border-[#E8B44D] focus:outline-none"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D] focus:border-[#E8B44D] focus:outline-none"
                        >
                            {typeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone *
                        </label>
                        <input
                            type="tel"
                            name="north_phone"
                            value={formData.north_phone}
                            onChange={handleChange}
                            placeholder="+221771234567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D] focus:border-[#E8B44D] focus:outline-none"
                        />
                        {errors.north_phone && <p className="text-red-500 text-xs mt-1">{errors.north_phone}</p>}
                    </div>

                    {/* ID du gestionnaire */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID du gestionnaire *
                        </label>
                        <input
                            type="text"
                            name="manager_user_id"
                            value={formData.manager_user_id}
                            onChange={handleChange}
                            placeholder="usr_55"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D] focus:border-[#E8B44D] focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: usr_XX (ex: usr_56)</p>
                        {errors.manager_user_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.manager_user_id}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
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
                            className="flex-1 px-4 py-2.5 bg-[#E8B44D] text-white rounded-lg font-medium hover:bg-[#D9A53C] transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Traitement...' : point ? 'Modifier' : 'Créer le point'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
