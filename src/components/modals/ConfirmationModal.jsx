import { AlertCircle } from 'lucide-react';

export default function ConfirmationModal({
    title,
    message,
    confirmText = "Supprimer",
    cancelText = "Annuler",
    onConfirm,
    onCancel,
    isDestructive = true,
    isLoading = false
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                <div className="w-20 h-20 rounded-full bg-[#F5E6D3] flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#E5D5C0] flex items-center justify-center text-[#E8B44D]">
                        <span className="text-4xl font-bold">!</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {title}
                </h3>

                <p className="text-gray-600 mb-8 max-w-xs">
                    {message}
                </p>

                {isDestructive && (
                    <p className="text-sm text-gray-500 mb-8 max-w-xs">
                        Cette action est irréversible et supprimera toutes les données associées.
                    </p>
                )}

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition disabled:opacity-70 disabled:cursor-not-allowed
              ${isDestructive ? 'bg-[#DC2626] hover:bg-[#B91C1C]' : 'bg-[#E8B44D] hover:bg-[#D9A53C]'}`}
                    >
                        {isLoading ? 'Traitement...' : confirmText}
                    </button>

                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 bg-[#F3F4F6] text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
