import { useState } from 'react';
import { X, QrCode, Check, Package, User } from 'lucide-react';
import { lookupAgentShipment, receiveAgentShipmentByTrackingNumber } from '../../services/agentShipmentsService';

export default function ReceiveShipmentModal({ onClose, onReceive }) {
  const [method, setMethod] = useState('manual');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('search'); // 'search', 'confirm', 'success'
  const [shipmentData, setShipmentData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await lookupAgentShipment(inputValue);
      // Data might be array or object depending on API. Based on other code, lookup returns object or array.
      // Assuming unique result for tracking number.
      let result = null;
      if (Array.isArray(data)) {
        result = data.length > 0 ? data[0] : null;
      } else if (data && data.data) { // Laravel resource
        result = data.data;
      } else {
        result = data;
      }

      if (result) {
        setShipmentData(result);
        setStep('confirm');
      } else {
        setError('Aucun colis trouvé avec ce numéro.');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la recherche du colis.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!shipmentData) return;
    setLoading(true);
    try {
      await receiveAgentShipmentByTrackingNumber(shipmentData.tracking_number);
      setStep('success');
      if (onReceive) onReceive(shipmentData); // Notify parent to update list
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la réception. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('search');
    setInputValue('');
    setShipmentData(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Réception de Colis</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 'search' && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setMethod('qr')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${method === 'qr' ? 'bg-white text-[#E8B44D] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <QrCode className="w-4 h-4" />
                  Scanner un QR
                </button>
                <button
                  onClick={() => setMethod('manual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${method === 'manual' ? 'bg-white text-[#E8B44D] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <div className="w-4 h-4 border-2 border-current rounded text-[10px] flex items-center justify-center leading-none">12</div>
                  Entrer un numéro
                </button>
              </div>

              {method === 'manual' ? (
                <form onSubmit={handleSearch}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de colis ou ID de suivi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ex. YK-2025-001"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E8B44D] focus:border-transparent outline-none transition"
                    autoFocus
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                  <div className="flex gap-3 mt-8">
                    <button
                      type="submit"
                      disabled={loading || !inputValue.trim()}
                      className="flex-1 bg-[#E8B44D] text-white py-3.5 rounded-xl font-semibold hover:bg-[#D9A53C] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Recherche...' : 'Rechercher le colis'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-50 rounded-xl p-8 mb-4 flex items-center justify-center border-2 border-dashed border-gray-200">
                    <QrCode className="w-24 h-24 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">Le scanner capture automatiquement le code</p>
                  {/* Placeholder for QR implementation */}
                  <div className="flex gap-3 mt-8">
                    <button disabled className="flex-1 bg-[#E8B44D] text-white py-3 rounded-xl opacity-50 cursor-not-allowed">
                      Rechercher le colis
                    </button>
                    <button onClick={onClose} className="flex-1 border border-gray-200 py-3 rounded-xl">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'confirm' && shipmentData && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FDF6E7] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#E8B44D]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{shipmentData.tracking_number}</h3>
                  <p className="text-sm text-gray-500">
                    {shipmentData.sender_address} → {shipmentData.recipient_address}
                  </p>
                </div>
                <span className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                  {shipmentData.weight_kg} kg
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                  {shipmentData.status}
                </span>
              </div>

              {/* Recipient Card */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold border border-gray-100">
                  {shipmentData.recipient_first_name?.charAt(0)}{shipmentData.recipient_last_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {shipmentData.recipient_first_name} {shipmentData.recipient_last_name}
                  </h4>
                  <p className="text-sm text-[#5B9BAD] font-medium">Client</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Progression</span>
                  <span className="text-gray-500">4/5</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8B44D] w-[80%] rounded-full"></div>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-[#FDF6E7] border border-[#FDEECC] rounded-xl text-[#B88714] text-sm">
                Le colis passera à l'étape "Au point de retrait" après confirmation.
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-[#E8B44D] text-white py-3.5 rounded-xl font-semibold hover:bg-[#D9A53C] transition disabled:opacity-50"
                >
                  {loading ? 'Confirmation...' : 'Confirmer la réception'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-[#00C48C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Enregistrement réussi !
              </h2>
              <p className="text-gray-600 mb-8">
                Colis N° {shipmentData?.tracking_number} a été enregistré avec succès.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
