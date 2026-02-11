import { useState } from 'react';
import { X, Package, Check, User } from 'lucide-react';
import { lookupByPickupCode, deliverAgentShipment } from '../../services/agentShipmentsService';

export default function RemiseColisModal({ onClose, onDelivered }) {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('search'); // 'search' | 'confirm' | 'success'
  const [parcel, setParcel] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = inputCode.trim().replace(/\D/g, '').slice(0, 4);
    if (code.length !== 4) {
      setError('Le code doit contenir 4 chiffres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await lookupByPickupCode(code);
      setParcel(data);
      setStep('confirm');
    } catch (err) {
      setError(err?.message || 'Aucun colis arrivé avec ce code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!parcel?.tracking_number || !inputCode.trim()) return;
    const code = inputCode.trim().replace(/\D/g, '').slice(0, 4);
    setLoading(true);
    setError('');

    try {
      await deliverAgentShipment(parcel.tracking_number, code);
      setStep('success');
      if (onDelivered) onDelivered(parcel);
    } catch (err) {
      setError(err?.message || 'Erreur lors de la remise.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('search');
    setInputCode('');
    setParcel(null);
    setError('');
  };

  const recipientName = parcel
    ? [parcel.recipient_first_name, parcel.recipient_last_name].filter(Boolean).join(' ') || parcel.recipient_name || '–'
    : '–';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Remise de colis</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 'search' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Le destinataire vous communique le code à 4 chiffres reçu par SMS. Saisissez-le pour afficher le colis et procéder à la remise.
              </p>
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de retrait (4 chiffres) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setError('');
                  }}
                  placeholder="Ex. 1234"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5B9BAD] focus:border-transparent outline-none transition text-center text-lg tracking-widest"
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    disabled={loading || inputCode.replace(/\D/g, '').length !== 4}
                    className="flex-1 bg-[#5B9BAD] text-white py-3.5 rounded-xl font-semibold hover:bg-[#4A8999] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Recherche...' : 'Afficher le colis'}
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
            </div>
          )}

          {step === 'confirm' && parcel && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8F4F7] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#5B9BAD]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{parcel.tracking_number}</h3>
                  <p className="text-sm text-gray-500">
                    {parcel.sender_address || '–'} → {parcel.recipient_address || '–'}
                  </p>
                </div>
                <span className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                  {parcel.weight_kg ?? '–'} kg
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                  {parcel.status}
                </span>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold border border-gray-100">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{recipientName}</h4>
                  <p className="text-sm text-[#5B9BAD] font-medium">Destinataire</p>
                </div>
              </div>

              <div className="p-4 bg-[#E8F4F7] border border-[#5B9BAD]/30 rounded-xl text-[#2D6B7A] text-sm">
                Vérifiez l'identité du destinataire puis cliquez sur « Remettre le colis » pour valider la remise.
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDeliver}
                  disabled={loading}
                  className="flex-1 bg-[#5B9BAD] text-white py-3.5 rounded-xl font-semibold hover:bg-[#4A8999] transition disabled:opacity-50"
                >
                  {loading ? 'Remise en cours...' : 'Remettre le colis'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Autre code
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-[#00C48C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Colis remis au destinataire</h2>
              <p className="text-gray-600 mb-8">
                Le colis {parcel?.tracking_number} a été remis avec succès.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#5B9BAD] text-white py-3.5 rounded-xl font-semibold hover:bg-[#4A8999] transition"
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
