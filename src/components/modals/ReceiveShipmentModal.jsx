import { useState } from 'react';
import { X, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

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
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Réception de Colis</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-700">{success}</p>
            </div>
          )}

          {/* Confirmation Step */}
          {confirmStep && selectedShipment && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3">Confirmer la réception</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-semibold text-gray-900">{selectedShipment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suivi:</span>
                    <span className="font-semibold text-gray-900">{selectedShipment.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destinataire:</span>
                    <span className="font-semibold text-gray-900">{selectedShipment.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-semibold text-gray-900">{selectedShipment.recipientPhone}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  Le colis passera à l'étape "Au point de retrait" après confirmation.
                </div>
              </div>

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
            <div className="space-y-6">
              {/* Method Tabs - Button Style */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMethod('qr');
                    setError('');
                    setManualCode('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition ${method === 'qr'
                    ? 'bg-[#E8B44D] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <QrCode className="h-5 w-5" />
                  Scanner un QR
                </button>
                <button
                  onClick={() => {
                    setMethod('manual');
                    setError('');
                    setQrCode('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition ${method === 'manual'
                    ? 'bg-[#E8B44D] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Entrer un numéro
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
                <div className="space-y-6">
                  {/* QR Code Scanner Area - Simple Design */}
                  <div className="bg-gray-50 rounded-xl p-12 border border-gray-200">
                    <div className="flex flex-col items-center justify-center">
                      {/* Simple QR Code Icon */}
                      <svg className="w-32 h-32 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2v-2zM15 15h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM17 13h2v2h-2v-2zM19 15h2v2h-2v-2zM17 17h2v2h-2v-2zM19 19h2v2h-2v-2z" />
                      </svg>

                      <p className="text-sm text-gray-600 text-center">
                        Le scanner capture automatiquement le code
                      </p>

                      <input
                        type="text"
                        autoFocus
                        value={qrCode}
                        onChange={handleQrScan}
                        className="absolute opacity-0 w-0 h-0"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 bg-[#E8B44D] text-white rounded-lg font-semibold hover:bg-[#D9A53C] transition shadow-sm"
                    >
                      Rechercher le colis
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Input Method */}
              {method === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Numéro de colis ou ID de suivi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => {
                        setManualCode(e.target.value);
                        setError('');
                      }}
                      placeholder="Ex. YK-2025-001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/50 focus:border-[#E8B44D] transition-all outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-[#E8B44D] text-white rounded-lg font-semibold hover:bg-[#D9A53C] transition shadow-sm"
                    >
                      Rechercher le colis
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
