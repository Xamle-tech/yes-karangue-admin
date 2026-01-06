import React from 'react';
import { Check, X } from 'lucide-react';

export default function ShipmentSuccessModal({ trackingNumber, onClose, onPrint }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">

                {/* Contenu */}
                <div className="flex flex-col items-center text-center">

                    {/* Icône succès */}
                    <div className="w-20 h-20 bg-[#00C48C] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>

                    {/* Titre */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Colis Enregistré avec Succès!
                    </h2>

                    {/* Bloc Numéro de suivi */}
                    <div className="w-full bg-[#FAF9F7] rounded-xl p-6 mb-8 border border-[#F0EFE9]">
                        <p className="text-gray-500 text-sm mb-2">Numéro de Suivi</p>
                        <p className="text-2xl font-bold text-gray-900 tracking-wider">
                            {trackingNumber}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onPrint}
                            className="flex-1 py-3 px-4 bg-white border border-[#E8B44D] text-[#D9A53C] font-semibold rounded-2xl hover:bg-orange-50 transition"
                        >
                            Imprimer la lettre
                        </button>

                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 font-semibold rounded-2xl hover:bg-gray-200 transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
