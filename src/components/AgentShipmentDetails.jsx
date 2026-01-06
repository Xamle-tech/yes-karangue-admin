import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Printer,
    Download,
    Package,
    MapPin,
    Truck,
    User,
    MoreVertical,
    Check
} from 'lucide-react';
import { fetchAgentShipmentById, updateAgentShipmentStatus } from '../services/agentShipmentsService';

export default function AgentShipmentDetails({ shipmentId, onBack }) {
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadShipmentDetails();
    }, [shipmentId]);

    const loadShipmentDetails = async () => {
        try {
            setLoading(true);
            const data = await fetchAgentShipmentById(shipmentId);
            setShipment(data);
        } catch (error) {
            console.error('Erreur chargement détails:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdating(true);
            // Appeler l'API de mise à jour
            await updateAgentShipmentStatus(shipmentId, {
                new_status: newStatus,
                event_time: new Date().toISOString()
            });
            // Recharger les détails
            await loadShipmentDetails();
        } catch (error) {
            console.error('Erreur mise à jour statut:', error);
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="animate-spin h-8 w-8 border-4 border-[#E8B44D] rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (!shipment) return null;

    // Configuration des étapes pour la droite
    const steps = [
        { id: 1, status: 'DEPOT', label: 'Dépôt du colis', desc: 'Le colis a été déposé' },
        { id: 2, status: 'PRISE_EN_CHARGE', label: 'Prise en charge', desc: 'Le transporteur a pris en charge le colis' },
        { id: 3, status: 'EN_COURS_LIVRAISON', label: 'En cours de livraison', desc: 'Le colis est en route vers sa destination' },
        { id: 4, status: 'ARRIVE', label: 'Arrivé', desc: 'Au point de retrait' }, // Le statut backend est peut-être différent (RECUPERE ?)
        { id: 5, status: 'LIVRE', label: 'Livré', desc: 'Remis au destinataire' },
    ];

    // Mapping du statut actuel vers l'index d'étape
    const getCurrentStepIndex = (status) => {
        const map = {
            'DEPOT': 0,
            'PRISE_EN_CHARGE': 1,
            'EN_COURS_LIVRAISON': 2,
            'RECUPERE': 3, // Correspond à Arrivé au point relais
            'LIVRE': 4
        };
        return map[status] || 0;
    };

    const currentStepIndex = getCurrentStepIndex(shipment.status);

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{shipment.tracking_number}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>Gestion des Colis</span>
                            <span>›</span>
                            <span>Colis N° {shipment.tracking_number}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        <Printer className="h-4 w-4" />
                        Imprimer
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        <Download className="h-4 w-4" />
                        Télécharger
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne Gauche (Détails) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Carte Colis & Trajet */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{shipment.tracking_number}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(shipment.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                {shipment.status}
                            </span>
                        </div>

                        {/* Timeline Trajet */}
                        <div className="relative pl-4 space-y-8 border-l-2 border-dotted border-gray-200 ml-2 my-8">
                            {/* Point de départ */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-[#E8B44D] bg-white ring-4 ring-orange-50"></div>
                                <div className="flex justify-between items-start -mt-1 pl-4">
                                    <div>
                                        <p className="font-medium text-gray-900">Point Relais {shipment.sender_city || 'Départ'}</p>
                                        <p className="text-xs text-gray-500">{shipment.sender_address}</p>
                                    </div>
                                    <span className="text-xs font-medium text-[#5B9BAD]">
                                        {new Date(shipment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            {/* Point d'arrivée */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-50"></div>
                                <div className="flex justify-between items-start -mt-1 pl-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{shipment.recipient_city || 'Destination'}</p>
                                        <p className="text-xs text-gray-500">{shipment.recipient_address}</p>
                                    </div>
                                    <span className="text-xs font-medium text-[#5B9BAD]">--:--</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Progression</span>
                            <span className="text-sm font-medium text-gray-900">{(currentStepIndex + 1)}/5</span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#E8B44D]"
                                style={{ width: `${((currentStepIndex + 1) / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Info Colis */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="font-medium text-[#5B9BAD] mb-4">Colis électronique</h4>

                            {shipment.package_photo_url ? (
                                <img
                                    src={shipment.package_photo_url}
                                    alt="Colis"
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                            ) : (
                                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-400">
                                    <Package className="h-12 w-12" />
                                </div>
                            )}

                            <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                                {shipment.weight_kg} KG
                            </span>
                        </div>

                        <div className="space-y-6">
                            {/* Transporteur */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Transporteur</h4>
                                {shipment.transporter_id ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{shipment.transporter?.name || 'Transporteur'}</p>
                                            <p className="text-xs text-gray-500">ID: {shipment.transporter_id}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Non assigné</p>
                                )}
                            </div>

                            {/* Gestionnaire */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Gestionnaire</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                        MD
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Mama DIALLO</p>
                                        <p className="text-xs text-gray-500">Agent</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expéditeur & Destinataire */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Expéditeur */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="h-5 w-5 text-[#5B9BAD]" />
                                <h4 className="font-semibold text-gray-900">Expéditeur</h4>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Nom</span>
                                    <span className="font-medium text-gray-900 text-right">{shipment.sender_first_name} {shipment.sender_last_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Téléphone</span>
                                    <span className="font-medium text-gray-900 text-right">{shipment.sender_phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium text-gray-900 text-right truncate max-w-[150px]">{shipment.sender_email || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">CNI</span>
                                    <span className="font-medium text-gray-900 text-right">{shipment.sender_id_number || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Destinataire */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="h-5 w-5 text-[#5B9BAD]" />
                                <h4 className="font-semibold text-gray-900">Destinataire</h4>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Nom</span>
                                    <span className="font-medium text-gray-900 text-right">{shipment.recipient_first_name} {shipment.recipient_last_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Téléphone</span>
                                    <span className="font-medium text-gray-900 text-right">{shipment.recipient_phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Adresse</span>
                                    <span className="font-medium text-gray-900 text-right truncate max-w-[150px]">{shipment.recipient_address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Colonne Droite (Statuts) */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-fit">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Mettre à jour le statut</h3>

                    <div className="space-y-4">
                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const isNext = index === currentStepIndex + 1;

                            return (
                                <div
                                    key={step.id}
                                    className={`relative p-4 rounded-xl border transition-all ${isCompleted
                                            ? 'border-[#E8B44D] bg-orange-50/50'
                                            : 'border-gray-100 bg-white opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm flex-shrink-0
                      ${isCompleted ? 'bg-[#E8B44D] text-white' : 'bg-gray-100 text-gray-400'}
                    `}>
                                            {step.id}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {step.label}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                                        </div>

                                        {isCompleted ? (
                                            <div className="w-6 h-6 bg-[#E8B44D] rounded-full flex items-center justify-center">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                                        )}
                                    </div>

                                    {isNext && (
                                        <button
                                            onClick={() => handleStatusUpdate(step.status)}
                                            disabled={updating}
                                            className="mt-4 w-full py-2 bg-[#E8B44D] text-white rounded-lg text-sm font-medium hover:bg-[#D9A53C] transition disabled:opacity-50"
                                        >
                                            {updating ? 'Mise à jour...' : 'Confirmer'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <p className="text-xs text-orange-800 leading-relaxed">
                            Note: Les étapes 4 (Au point de retrait) et 5 (Remis au destinataire)
                            nécessitent une confirmation de réception via le bouton "Réception de Colis".
                        </p>
                    </div>

                    <button
                        onClick={() => handleStatusUpdate('ARRIVE')} // Bouton test pour forcer l'avancement
                        className="w-full mt-4 py-3 bg-[#D9A53C] text-white rounded-xl font-bold hover:bg-[#C8942B] transition shadow-sm"
                    >
                        Confirmer la mise à jour
                    </button>
                </div>
            </div>
        </div>
    );
}
