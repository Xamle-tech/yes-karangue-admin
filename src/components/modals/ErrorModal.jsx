import { X } from 'lucide-react';

export default function ErrorModal({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full flex flex-col items-center animate-in fade-in zoom-in duration-200 shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white">
                        <X className="h-8 w-8" strokeWidth={3} />
                    </div>
                </div>

                <p className="text-xl font-medium text-gray-900 text-center mb-8">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}
