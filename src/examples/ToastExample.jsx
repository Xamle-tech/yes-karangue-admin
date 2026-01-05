/**
 * Exemple d'utilisation du composant Toast dans différents contextes
 */

import { useState } from 'react';
import Toast from '../components/Toast';

export default function ToastExample() {
    const [toast, setToast] = useState(null);

    // Exemple 1: Succès
    const showSuccessToast = () => {
        setToast({
            message: 'Point relais supprimé avec succès',
            type: 'success'
        });
    };

    // Exemple 2: Erreur
    const showErrorToast = () => {
        setToast({
            message: 'Une erreur est survenue lors de la suppression',
            type: 'error'
        });
    };

    // Exemple 3: Avertissement
    const showWarningToast = () => {
        setToast({
            message: 'Ce point relais est en cours d\'utilisation',
            type: 'warning'
        });
    };

    // Exemple 4: Avec gestion asynchrone
    const handleAsyncOperation = async () => {
        try {
            // Simuler une opération asynchrone
            await new Promise(resolve => setTimeout(resolve, 1000));

            setToast({
                message: 'Opération terminée avec succès',
                type: 'success'
            });
        } catch (error) {
            setToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Exemples de Toast</h1>

            <div className="space-y-2">
                <button
                    onClick={showSuccessToast}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Afficher Toast Succès
                </button>

                <button
                    onClick={showErrorToast}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Afficher Toast Erreur
                </button>

                <button
                    onClick={showWarningToast}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Afficher Toast Avertissement
                </button>

                <button
                    onClick={handleAsyncOperation}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Opération Asynchrone
                </button>
            </div>

            {/* Afficher le toast s'il existe */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
