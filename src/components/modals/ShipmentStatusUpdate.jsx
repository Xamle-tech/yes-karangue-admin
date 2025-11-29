import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function ShipmentStatusUpdate({ shipment, onUpdate, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState(shipment.status);

  const statuses = [
    { value: 1, label: 'Dépôt du colis', description: 'Le colis a été déposé' },
    {
      value: 2,
      label: 'Prise en charge',
      description: 'Le transporteur a pris en charge le colis',
    },
    {
      value: 3,
      label: 'En cours de livraison',
      description: 'Le colis est en route vers sa destination',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(shipment.id, selectedStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Mettre à jour le statut
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Shipment Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Colis</p>
            <p className="font-bold text-gray-900">{shipment.id}</p>
            <p className="text-sm text-gray-600 mt-2">
              {shipment.origin} → {shipment.destination}
            </p>
          </div>

          {/* Current Status */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Statut actuel</p>
            <p className="font-semibold text-blue-900">
              Étape {shipment.status}/5 -{' '}
              {statuses.find((s) => s.value === shipment.status)?.label || 'Inconnu'}
            </p>
          </div>

          {/* Status Options */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              Sélectionnez le nouveau statut
            </p>
            {statuses.map((status) => (
              <label
                key={status.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                  selectedStatus === status.value
                    ? 'border-[#305669] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${status.value < shipment.status ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={selectedStatus === status.value}
                  onChange={(e) => setSelectedStatus(Number(e.target.value))}
                  disabled={status.value < shipment.status}
                  className="mt-1 w-4 h-4 text-[#305669] focus:ring-[#305669]"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      Étape {status.value} - {status.label}
                    </p>
                    {selectedStatus === status.value && (
                      <CheckCircle className="h-5 w-5 text-[#305669]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                  {status.value < shipment.status && (
                    <p className="text-xs text-gray-500 mt-1">✓ Déjà complété</p>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Warning for automated steps */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Note:</strong> Les étapes 4 (Au point de retrait) et 5
              (Remis au destinataire) seront mises à jour automatiquement par le
              système.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={selectedStatus === shipment.status}
              className="flex-1 px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmer la mise à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

