import {
    ArrowLeft,
    Printer,
    Download,
    Box,
    User,
    MapPin,
    Phone,
    Mail,
    Car,
    CheckCircle,
    Clock,
    Circle,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import boxIcon from '../icons/box.png';
import { printWaybill, downloadWaybill } from '../services/agentShipmentsService';

export default function AgentShipmentDetails({ shipmentId, shipment, onBack }) {
    // Use passed shipment or fallbacks
    const data = shipment || {
        id: shipmentId,
        tracking_number: 'YK-2025-05',
        created_at: new Date(),
        status: 'DEPOT',
        // ... mocked data if null, but it should be passed
    };

    const [selectedStatus, setSelectedStatus] = useState(data.status);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    const handlePrint = async () => {
        if (!data.tracking_number) {
            setError('Numéro de suivi manquant');
            return;
        }

        setIsPrinting(true);
        setError(null);
        try {
            await printWaybill(data.tracking_number);
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'impression');
            console.error('Erreur impression:', err);
        } finally {
            setIsPrinting(false);
        }
    };

    const handleDownload = async () => {
        if (!data.tracking_number) {
            setError('Numéro de suivi manquant');
            return;
        }

        setIsDownloading(true);
        setError(null);
        try {
            await downloadWaybill(data.tracking_number);
        } catch (err) {
            setError(err.message || 'Erreur lors du téléchargement');
            console.error('Erreur téléchargement:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    // Status mapping for timeline
    const steps = [
        {
            id: 1,
            key: 'DEPOT',
            label: 'Dépôt du colis',
            desc: 'Le colis a été déposé',
            completed: ['DEPOT', 'PRISE_EN_CHARGE', 'EN_COURS_LIVRAISON', 'RECUPERE', 'LIVRE'].includes(data.status)
        },
        {
            id: 2,
            key: 'PRISE_EN_CHARGE',
            label: 'Prise en charge',
            desc: 'Le transporteur a pris en charge le colis',
            completed: ['PRISE_EN_CHARGE', 'EN_COURS_LIVRAISON', 'RECUPERE', 'LIVRE'].includes(data.status)
        },
        {
            id: 3,
            key: 'EN_COURS_LIVRAISON',
            label: 'En cours de livraison',
            desc: 'Le colis est en route vers sa destination',
            completed: ['EN_COURS_LIVRAISON', 'RECUPERE', 'LIVRE'].includes(data.status)
        },
        {
            id: 4,
            key: 'RECUPERE',
            label: 'Arrivé',
            desc: 'Au point de retrait',
            completed: ['RECUPERE', 'LIVRE'].includes(data.status),
            disabled: true // Automatic
        },
        {
            id: 5,
            key: 'LIVRE',
            label: 'Livré',
            desc: 'Remis au destinataire',
            completed: ['LIVRE'].includes(data.status),
            disabled: true // Automatic
        }
    ];

    /* Status Colors & Labels helpers matching dashboard */
    const getStatusInfo = (status) => {
        switch (status) {
            case 'DEPOT': return { label: 'Dépôt', color: 'text-gray-500', bg: 'bg-gray-100' };
            case 'PRISE_EN_CHARGE': return { label: 'Prise en charge', color: 'text-[#5B9BAD]', bg: 'bg-[#EFF8FA]' };
            case 'EN_COURS_LIVRAISON': return { label: 'En cours', color: 'text-[#E8B44D]', bg: 'bg-[#FEF9EA]' };
            case 'RECUPERE': return { label: 'Récupéré', color: 'text-purple-600', bg: 'bg-purple-50' };
            case 'LIVRE': return { label: 'Livré', color: 'text-green-600', bg: 'bg-green-50' };
            default: return { label: status, color: 'text-gray-600', bg: 'bg-gray-50' };
        }
    };

    const currentStatusInfo = getStatusInfo(data.status);

    return (
        <div className="space-y-6">

            {/* Top Header Navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="bg-white p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{data.tracking_number}</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        Gestion des Colis <span className="text-gray-300">›</span> Colis N° {data.tracking_number}
                    </p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex gap-3">
                        <button 
                            onClick={handlePrint}
                            disabled={isPrinting || isDownloading}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Printer className="h-4 w-4" />
                            {isPrinting ? 'Impression...' : 'Imprimer'}
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={isPrinting || isDownloading}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Download className="h-4 w-4" />
                            {isDownloading ? 'Téléchargement...' : 'Télécharger'}
                        </button>
                    </div>
                    {error && (
                        <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Shipment Card + Transporter + Manager */}
                <div className="space-y-6">
                    {/* Shipment Summary Card (Reusing the Grid Card Design) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                        {/* Card Header: Icon + Info + Status Text */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-[#F9F5EB] rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <img src={boxIcon} alt="Package" className="h-6 w-6 object-contain opacity-80" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{data.tracking_number}</h3>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {data.created_at ? new Date(data.created_at).toLocaleDateString('fr-FR') : 'Date N/A'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${currentStatusInfo.bg} ${currentStatusInfo.color}`}>
                                    {currentStatusInfo.label}
                                </span>
                            </div>
                        </div>

                        {/* Route Timeline */}
                        <div className="space-y-6 relative mb-8">
                            {/* Vertical Dotted Line */}
                            <div className="absolute left-[7px] top-2 bottom-4 w-0.5 border-l-2 border-dotted border-gray-300"></div>

                            {/* Origin */}
                            <div className="relative flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="relative z-10 w-4 h-4 rounded-full border-2 border-[#E8B44D] bg-white mt-1"></div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{data.sender_city || data.sender_address || 'Point Relais'}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-[#5B9BAD] font-medium">10:30</span>
                            </div>

                            {/* Destination */}
                            <div className="relative flex justify-between items-start">
                                <div className="flex gap-4">
                                    <MapPin className="relative z-10 w-4 h-4 text-[#D32F2F] mt-1" fill="currentColor" />
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{data.recipient_city || data.recipient_address || 'Destination'}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-[#5B9BAD] font-medium">11:05</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-gray-700">Progression</span>
                                <span className="text-sm font-medium text-gray-400">
                                    {
                                        data.status === 'DEPOT' ? '1/5' :
                                            data.status === 'PRISE_EN_CHARGE' ? '2/5' :
                                                data.status === 'EN_COURS_LIVRAISON' ? '3/5' :
                                                    data.status === 'RECUPERE' ? '4/5' :
                                                        data.status === 'LIVRE' ? '5/5' : '0/5'
                                    }
                                </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
                                <div
                                    className="h-full bg-[#E8B44D] rounded-full"
                                    style={{
                                        width: `${data.status === 'DEPOT' ? 20 :
                                            data.status === 'PRISE_EN_CHARGE' ? 40 :
                                                data.status === 'EN_COURS_LIVRAISON' ? 60 :
                                                    data.status === 'RECUPERE' ? 80 :
                                                        data.status === 'LIVRE' ? 100 : 0
                                            }%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Transporter */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-[#5B9BAD] font-bold mb-4">Transporteur</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-50 p-3 rounded-full">
                                <Car className="h-6 w-6 text-[#E8B44D]" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Transport ABC</p>
                                <p className="text-sm text-gray-400">SN-123-ABC</p>
                            </div>
                        </div>
                    </div>

                    {/* Gestionnaire */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-[#5B9BAD] font-bold mb-4">Gestionnaire</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center font-bold text-gray-600">
                                MD
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Mama DIALLO</p>
                                <p className="text-sm text-gray-400">SN-123-ABC</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column: Photo + Sender + Recipient */}
                <div className="space-y-6">
                    {/* Photo Card */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        {/* Placeholder Image */}
                        <div className="bg-gray-200 rounded-xl h-48 w-full mb-4 overflow-hidden relative">
                            {/* In a real app, use shipment.photo_url */}
                            <img src="https://placehold.co/600x400/e2e8f0/94a3b8?text=Colis" alt="Colis" className="w-full h-full object-cover" />
                        </div>

                        <h3 className="text-[#5B9BAD] font-bold mb-2">Colis électronique</h3>

                        <span className="inline-block bg-gray-100 px-4 py-1 rounded-full text-sm font-bold text-gray-600">
                            2 KG
                        </span>
                    </div>

                    {/* Expéditeur */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#5B9BAD] font-bold mb-2">
                            <User className="h-5 w-5" />
                            <h3>Expéditeur</h3>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Nom</span>
                            <span className="text-gray-900 font-medium text-right">{data.sender_first_name} {data.sender_last_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Téléphone</span>
                            <span className="text-gray-900 font-medium text-right">{data.sender_phone_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Email</span>
                            <span className="text-gray-900 font-medium text-right break-all">{data.sender_email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Numéro pièce</span>
                            <span className="text-gray-900 font-medium text-right">1 1932 2002 00516</span>
                        </div>
                    </div>

                    {/* Destinataire */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#5B9BAD] font-bold mb-2">
                            <MapPin className="h-5 w-5" />
                            <h3>Destinataire</h3>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Nom</span>
                            <span className="text-gray-900 font-medium text-right">{data.recipient_first_name} {data.recipient_last_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Téléphone</span>
                            <span className="text-gray-900 font-medium text-right">{data.recipient_phone_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Email</span>
                            <span className="text-gray-900 font-medium text-right break-all">{data.recipient_email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Adresse</span>
                            <span className="text-gray-900 font-medium text-right">{data.recipient_address}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status Timeline */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Mettre à jour le statut</h2>

                        <div className="space-y-4 flex-1">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${step.completed
                                        ? 'bg-[#FEF9EA] border-[#E8B44D]'
                                        : 'bg-white border-gray-100'
                                        }`}
                                >
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${step.completed ? 'bg-[#E8B44D] text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {step.id}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-xs text-gray-400 mt-1">{step.desc}</p>
                                    </div>
                                    <div className="mt-1">
                                        {step.completed ? (
                                            <CheckCircle className="h-6 w-6 text-[#E8B44D]" fill="currentColor" />
                                        ) : (
                                            <Circle className="h-6 w-6 text-gray-200" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <div className="bg-[#FFF4F2] p-4 rounded-xl mb-6">
                                <p className="text-[#D32F2F] text-xs leading-relaxed">
                                    <span className="font-bold">Note:</span> Les étapes 4 (Au point de retrait) et 5 (Remis au destinataire) seront mises à jour automatiquement par le système.
                                </p>
                            </div>

                            <button className="w-full py-4 bg-[#E8B44D] text-white font-bold rounded-full hover:bg-[#D9A53C] transition shadow-sm">
                                Confirmer la mise à jour
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
