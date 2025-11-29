import { X, MapPin, Clock, Users, Phone, Mail } from 'lucide-react';

export default function PointDetails({ point, onClose, onEdit }) {
  const getTypeLabel = (type) => {
    const labels = {
      depot: 'Dépôt',
      retrait: 'Retrait',
      both: 'Dépôt & Retrait',
    };
    return labels[type] || type;
  };

  const getDaysLabel = (day) => {
    const labels = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
    };
    return labels[day] || day;
  };

  const workingDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{point.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Type Badge */}
          <div>
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              {getTypeLabel(point.type)}
            </span>
            <span className="ml-3 inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              {point.status === 'active' ? '✓ Actif' : '✗ Inactif'}
            </span>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#305669] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Adresse</p>
                <p className="text-gray-900 mt-1">{point.address}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#305669] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Téléphone</p>
                <p className="text-gray-900 mt-1">{point.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#305669] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-gray-900 mt-1">{point.email}</p>
              </div>
            </div>
          </div>

          {/* Manager Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-3">Gestionnaire</p>
            <div className="space-y-2">
              <p className="text-gray-900">{point.manager}</p>
              <p className="text-sm text-gray-600">Téléphone: {point.managerPhone}</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Agents assignés</p>
                  <p className="text-2xl font-bold text-blue-600">{point.agents}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div>
                <p className="text-sm text-gray-600">Colis traités</p>
                <p className="text-2xl font-bold text-purple-600">{point.shipmentsProcessed}</p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-[#305669]" />
              <p className="text-sm font-semibold text-gray-900">Horaires d'ouverture</p>
            </div>
            <div className="space-y-2">
              {workingDays.map((day) => (
                <div key={day} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900 w-32">
                    {getDaysLabel(day)}
                  </p>
                  {point.workingHours[day].closed ? (
                    <p className="text-sm text-red-600 font-medium">Fermé</p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {point.workingHours[day].start} - {point.workingHours[day].end}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Créé le {new Date(point.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition"
          >
            Modifier
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

