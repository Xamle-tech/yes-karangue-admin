import { useState } from 'react';
import { X, QrCode, Keyboard, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReceiveShipmentModal({ onClose, onReceive, shipments }) {
  const [method, setMethod] = useState('qr'); // 'qr' ou 'manual'
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [confirmStep, setConfirmStep] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleQrScan = (e) => {
    const code = e.target.value.trim();
    setQrCode(code);
    
    if (code) {
      // Chercher le colis par QR code
      const found = shipments.find((s) => s.id === code || s.trackingNumber === code);
      if (found) {
        setSelectedShipment(found);
        setError('');
        setConfirmStep(true);
      } else {
        setError('Colis non trouvé');
        setSelectedShipment(null);
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!manualCode.trim()) {
      setError('Veuillez entrer un numéro de colis');
      return;
    }

    // Chercher le colis
    const found = shipments.find(
      (s) => s.id === manualCode || s.trackingNumber === manualCode
    );

    if (found) {
      setSelectedShipment(found);
      setConfirmStep(true);
    } else {
      setError(`Colis "${manualCode}" non trouvé`);
      setSelectedShipment(null);
    }
  };

  const handleConfirmReception = () => {
    if (selectedShipment) {
      onReceive(selectedShipment);
      setSuccess('✓ Colis reçu avec succès!');
      
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setConfirmStep(false);
        setSelectedShipment(null);
        setQrCode('');
        setManualCode('');
        setSuccess('');
      }, 2000);
    }
  };

  const handleReset = () => {
    setSelectedShipment(null);
    setConfirmStep(false);
    setQrCode('');
    setManualCode('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Réception de Colis</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-700">{success}</p>
            </div>
          )}

          {/* Confirmation Step */}
          {confirmStep && selectedShipment && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3">Confirmer la réception</h3>
                
                {/* Shipment Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedShipment.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suivi:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedShipment.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destinataire:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedShipment.recipient}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedShipment.recipientPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Poids:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedShipment.weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut actuel:</span>
                    <span className="font-semibold text-yellow-600">
                      Étape {selectedShipment.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  Le colis passera à l'étape "Au point de retrait" après confirmation.
                </div>
              </div>

              {/* Confirm Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmReception}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Confirmer Réception
                </button>
              </div>
            </div>
          )}

          {/* Method Selection */}
          {!confirmStep && (
            <>
              {/* Method Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setMethod('qr');
                    setError('');
                    setManualCode('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition ${
                    method === 'qr'
                      ? 'bg-[#305669] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR
                </button>
                <button
                  onClick={() => {
                    setMethod('manual');
                    setError('');
                    setQrCode('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition ${
                    method === 'manual'
                      ? 'bg-[#305669] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Keyboard className="h-4 w-4" />
                  Saisie Manuelle
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* QR Code Method */}
              {method === 'qr' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <QrCode className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Placez le lecteur QR ici
                    </p>
                  </div>

                  <input
                    type="hidden"
                    autoFocus
                    value={qrCode}
                    onChange={handleQrScan}
                    placeholder="Scanner le QR code..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Le scanner capture automatiquement le code
                  </p>
                </div>
              )}

              {/* Manual Input Method */}
              {method === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Numéro de colis ou ID de suivi
                    </label>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => {
                        setManualCode(e.target.value);
                        setError('');
                      }}
                      placeholder="Ex: YK-2025-00001 ou TRK001"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition"
                  >
                    Rechercher Colis
                  </button>
                </form>
              )}

              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>💡 Conseil:</strong> Utilisez le scan QR pour plus de rapidité.
                  Si le scanner ne fonctionne pas, saisissez manuellement le numéro.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

