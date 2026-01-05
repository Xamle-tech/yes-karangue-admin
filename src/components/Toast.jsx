import { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const types = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <XCircle className="h-5 w-5 text-red-600" />,
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        },
    };

    const config = types[type] || types.success;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className={`${config.bg} ${config.border} ${config.text} border rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3`}>
                <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
