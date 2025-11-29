import { X, Smartphone, User, Mail, Phone, MapPin, Activity, Package } from 'lucide-react';

export default function ClientDetails({ client, onClose, onEdit }) {
  const getTypeLabel = (type) => {
    const labels = {
      shipper: 'Expéditeur',
      recipient: 'Destinataire',
      both: 'Exp. & Dest.',
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Client Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#305669] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm text-gray-900 font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#305669] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Téléphone</p>
                  <p className="text-sm text-gray-900 font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#305669] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Adresse</p>
                  <p className="text-sm text-gray-900 font-medium">{client.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Status */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Statut Application</h3>
              {client.hasApp ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Installée</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-700">Non installée</span>
                </div>
              )}
            </div>
            {client.hasApp && (
              <p className="text-xs text-gray-600">
                Téléchargée le{' '}
                <strong>
                  {new Date(client.appDownloadDate).toLocaleDateString('fr-FR')}
                </strong>
              </p>
            )}
          </div>

          {/* Client Type & Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-gray-600 mb-2">Type de client</p>
              <p className="text-lg font-bold text-blue-600">{getTypeLabel(client.type)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-xs text-gray-600 mb-2">Total colis</p>
              <p className="text-lg font-bold text-purple-600">{client.totalShipments}</p>
              <p className="text-xs text-gray-500 mt-1">
                {client.shipmentsSent} envoyés, {client.shipmentsReceived} reçus
              </p>
            </div>
          </div>

          {/* Activity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-[#305669]" />
              <h3 className="text-sm font-semibold text-gray-900">Dernier accès</h3>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(client.lastActivity).toLocaleDateString('fr-FR')} à{' '}
              {new Date(client.lastActivity).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Activity History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Historique d'activité</h3>
            <div className="space-y-3">
              {client.activityHistory && client.activityHistory.length > 0 ? (
                client.activityHistory.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      {activity.action.includes('Déposé') ? (
                        <Package className="h-4 w-4 text-blue-600 mt-1" />
                      ) : (
                        <Package className="h-4 w-4 text-green-600 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </p>
                      {activity.shipmentId && (
                        <p className="text-xs text-gray-600 mt-1">
                          Colis: <strong>{activity.shipmentId}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Aucune activité enregistrée</p>
              )}
            </div>
          </div>

          {/* Registration Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Enregistré le:</strong>{' '}
              {new Date(client.createdAt).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Méthode:</strong>{' '}
              {client.registrationMethod === 'app'
                ? 'Via l\'application'
                : client.registrationMethod === 'shipment_registration'
                ? 'Lors du dépôt d\'un colis'
                : 'Ajout manuel'}
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

