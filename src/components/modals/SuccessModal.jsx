import { Check } from 'lucide-react';

export default function SuccessModal({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full flex flex-col items-center animate-in fade-in zoom-in duration-200">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <Check className="h-8 w-8" strokeWidth={3} />
                    </div>
                </div>

                <p className="text-xl font-medium text-gray-900 text-center mb-8">
                    {message}
                </p>

                {/* Fermeture automatique gérée par le parent ou clic extérieur, 
            mais ici on peut ajouter un gestionnaire d'événement sur l'overlay si voulu.
            Pour l'instant, c'est un modal simple d'information. */}
            </div>
        </div>
    );
}
