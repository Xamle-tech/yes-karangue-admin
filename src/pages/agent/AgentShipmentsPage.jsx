import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Package, Filter } from 'lucide-react';
import Toast from '../../components/Toast';
import { fetchAgentShipments, fetchAgentShipmentById, createAgentShipment } from '../../services/agentShipmentsService';

export default function AgentShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [toast, setToast] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [viewingShipmentId, setViewingShipmentId] = useState(null);

    // Charger les colis depuis l'API
    const loadShipments = async () => {
        try {
            setLoading(true);
            const params = {};

            if (searchTerm) params.tracking_number = searchTerm;
            if (filterStatus) params.status = filterStatus;

            const data = await fetchAgentShipments(params);

            // Gérer différents formats de réponse
            if (Array.isArray(data)) {
                setShipments(data);
            } else if (data.data) {
                setShipments(data.data);
            } else {
                setShipments([]);
            }
        } catch (error) {
            console.error('Erreur chargement:', error);
            setToast({
                message: error.message,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Voir les détails d'un colis
    const handleViewShipment = async (shipmentId) => {
        try {
            setViewingShipmentId(shipmentId);
            const shipment = await fetchAgentShipmentById(shipmentId);
            setSelectedShipment(shipment);
            setShowDetailsModal(true);
        } catch (error) {
            setToast({
                message: error.message,
                type: 'error'
            });
        } finally {
            setViewingShipmentId(null);
        }
    };

    // Charger au montage et quand les filtres changent
    useEffect(() => {
        loadShipments();
    }, [searchTerm, filterStatus]);

    const stats = {
        total: shipments.length,
        depot: shipments.filter(s => s.status === 'DEPOT').length,
        enCours: shipments.filter(s => s.status === 'EN_COURS').length,
        livres: shipments.filter(s => s.status === 'LIVRE').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mes Colis</h1>
                    <p className="text-gray-600 mt-1">
                        Gérez les colis de votre point relais
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Nouveau colis
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Colis</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Package className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Dépôt */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">En Dépôt</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.depot}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                            <Package className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* En cours */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">En Cours</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.enCours}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Livrés */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Livrés</p>
                            <p className="text-3xl font-bold text-green-600">{stats.livres}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par numéro de suivi (ex: YK-2025-00001)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none bg-white"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="DEPOT">Dépôt</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="LIVRE">Livré</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Shipments Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Chargement...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Numéro de suivi
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Expéditeur
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Destinataire
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Poids
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {shipments.length > 0 ? shipments.map((shipment, index) => (
                                        <tr
                                            key={shipment.id}
                                            className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-gray-400" />
                                                    <span className="font-mono text-sm font-semibold text-gray-900">
                                                        {shipment.tracking_number || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <p className="font-medium text-gray-900">{shipment.sender_full_name || 'N/A'}</p>
                                                <p className="text-gray-500 text-xs">{shipment.sender_phone || ''}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <p className="font-medium text-gray-900">{shipment.recipient_full_name || 'N/A'}</p>
                                                <p className="text-gray-500 text-xs">{shipment.recipient_phone || ''}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {shipment.weight_kg ? `${shipment.weight_kg} kg` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {shipment.created_at ? new Date(shipment.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${shipment.status === 'DEPOT' ? 'bg-orange-100 text-orange-800' :
                                                        shipment.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                                                            shipment.status === 'LIVRE' ? 'bg-green-100 text-green-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {shipment.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleViewShipment(shipment.id)}
                                                        disabled={viewingShipmentId === shipment.id}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition disabled:opacity-50"
                                                        title="Voir les détails"
                                                    >
                                                        {viewingShipmentId === shipment.id ? (
                                                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                Aucun colis trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Empty State */}
            {!loading && shipments.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Aucun colis trouvé</p>
                    <p className="text-gray-500 text-sm mt-1">Créez votre premier colis pour commencer</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4 inline-flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Nouveau colis
                    </button>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedShipment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Détails du colis</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Numéro de suivi */}
                            <div>
                                <p className="text-sm text-gray-500">Numéro de suivi</p>
                                <p className="font-mono text-xl font-bold text-gray-900">{selectedShipment.tracking_number}</p>
                            </div>

                            {/* Informations expéditeur */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expéditeur</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Nom complet</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.sender_full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.sender_phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">Adresse</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.sender_address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations destinataire */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Destinataire</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Nom complet</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.recipient_full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.recipient_phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">Adresse</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.recipient_address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations colis */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du colis</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Poids</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.weight_kg ? `${selectedShipment.weight_kg} kg` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Statut</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${selectedShipment.status === 'DEPOT' ? 'bg-orange-100 text-orange-800' :
                                                selectedShipment.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                                                    selectedShipment.status === 'LIVRE' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {selectedShipment.status || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">Description du contenu</p>
                                        <p className="font-medium text-gray-900">{selectedShipment.content_description || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
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
