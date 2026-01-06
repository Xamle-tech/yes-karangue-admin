import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Package,
  Eye,
  Download,
  Grid3x3,
  List,
  ChevronDown
} from 'lucide-react';
import AgentShipmentForm from '../../components/forms/AgentShipmentForm';
import AgentShipmentDetails from '../../components/AgentShipmentDetails';
import ShipmentStatusUpdate from '../../components/modals/ShipmentStatusUpdate';
import ReceiveShipmentModal from '../../components/modals/ReceiveShipmentModal';
import ShipmentSuccessModal from '../../components/modals/ShipmentSuccessModal';
import { fetchAgentShipments, createAgentShipment } from '../../services/agentShipmentsService';

export default function AgentDashboardPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [createdShipment, setCreatedShipment] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Charger les colis depuis l'API
  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const data = await fetchAgentShipments();

      // Gérer la réponse paginée
      const shipmentsData = Array.isArray(data) ? data : (data.data || []);
      setShipments(shipmentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des colis:', error);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(
    (shipment) => {
      const search = searchTerm.toLowerCase();
      const recipientName = `${shipment.recipient_first_name || ''} ${shipment.recipient_last_name || ''}`.toLowerCase();
      return (
        (shipment.id?.toString() || '').includes(search) ||
        (shipment.tracking_number || '').toLowerCase().includes(search) ||
        recipientName.includes(search)
      );
    }
  );

  const handleAddShipment = async (formData) => {
    try {
      // Importer createAgentShipment depuis le service
      const { createAgentShipment } = await import('../../services/agentShipmentsService');

      // Appeler l'API pour créer le colis
      const newShipment = await createAgentShipment(formData);

      console.log('📦 Colis créé:', newShipment);
      setCreatedShipment(newShipment);

      // Recharger la liste des colis
      await loadShipments();

      // Fermer le formulaire et ouvrir le modal de succès
      setShowForm(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('❌ Erreur lors de la création du colis:', error);
      alert('Erreur lors de la création du colis. Veuillez réessayer.');
    }
  };

  const handleReceiveShipment = (shipment) => {
    setShipments(
      shipments.map((s) =>
        s.id === shipment.id ? { ...s, status: 'Au point', progress: 4 } : s
      )
    );
    setShowReceive(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'DEPOT': { color: 'bg-orange-100 text-orange-700', icon: '📦', label: 'Dépôt' },
      'PRISE_EN_CHARGE': { color: 'bg-blue-100 text-blue-700', icon: '📋', label: 'Prise en charge' },
      'EN_COURS_LIVRAISON': { color: 'bg-yellow-100 text-yellow-700', icon: '🚚', label: 'En cours de livraison' },
      'RECUPERE': { color: 'bg-purple-100 text-purple-700', icon: '📥', label: 'Récupéré' },
      'LIVRE': { color: 'bg-green-100 text-green-700', icon: '✅', label: 'Livré' },
    };

    const config = statusConfig[status] || statusConfig['DEPOT'];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.color}`}>
        <span>{config.icon}</span>
        {config.label || status}
      </span>
    );
  };

  const stats = [
    { label: 'Total colis', value: shipments.length.toString().padStart(2, '0'), icon: Package },
    { label: 'En dépôt', value: shipments.filter(s => s.status === 'DEPOT').length.toString(), icon: Package },
    { label: 'Pris en charge', value: shipments.filter(s => s.status === 'PRISE_EN_CHARGE').length.toString(), icon: Package },
    { label: 'En cours', value: shipments.filter(s => s.status === 'EN_COURS_LIVRAISON').length.toString(), icon: Package },
  ];

  if (showDetails && selectedShipment) {
    return (
      <AgentShipmentDetails
        shipmentId={selectedShipment.id}
        onBack={() => {
          setShowDetails(false);
          setSelectedShipment(null);
          loadShipments();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Espace Agent – Gestion des Colis
          </h1>
          <p className="text-gray-600 mt-2">
            Déposez et recevez les colis à votre point de retrait.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowReceive(true)}
            className="flex items-center gap-2 bg-[#5B9BAD] text-white px-5 py-2.5 rounded-lg hover:bg-[#4A8999] transition font-medium shadow-sm"
          >
            <Download className="h-5 w-5" />
            Réception de Colis
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Déposer un colis
          </button>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <AgentShipmentForm
          onSubmit={handleAddShipment}
          onClose={() => setShowForm(false)}
        />
      )}

      {showSuccessModal && createdShipment && (
        <ShipmentSuccessModal
          trackingNumber={createdShipment.tracking_number}
          onClose={() => setShowSuccessModal(false)}
          onPrint={() => {
            // Implémentation future pour l'impression
            console.log('Impression pour:', createdShipment.tracking_number);
          }}
        />
      )}

      {showStatusUpdate && selectedShipment && (
        <ShipmentStatusUpdate
          shipment={selectedShipment}
          onUpdate={(id, status) => {
            setShipments(
              shipments.map((s) => (s.id === id ? { ...s, status } : s))
            );
            setShowStatusUpdate(false);
            setSelectedShipment(null);
          }}
          onClose={() => {
            setShowStatusUpdate(false);
            setSelectedShipment(null);
          }}
        />
      )}

      {showReceive && (
        <ReceiveShipmentModal
          onClose={() => setShowReceive(false)}
          onReceive={handleReceiveShipment}
          shipments={shipments}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, numéro de suivi ou destinataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD]/50 focus:border-[#5B9BAD] transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700">
              <span>Tous les statuts</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition ${viewMode === 'list' ? 'bg-[#E8B44D] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition ${viewMode === 'grid' ? 'bg-[#E8B44D] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-[#E8B44D] rounded-full border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Chargement des colis...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Colis</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Expéditeur</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Destinataire</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Progression</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date demande</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment, index) => (
                    <tr
                      key={shipment.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      {/* Colis */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{shipment.tracking_number || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{shipment.sender_address || ''} → {shipment.recipient_address || ''}</p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">{shipment.content_description || 'N/A'}</p>
                      </td>

                      {/* Expéditeur */}
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">{`${shipment.sender_first_name || ''} ${shipment.sender_last_name || ''}`.trim() || 'N/A'}</p>
                      </td>

                      {/* Destinataire */}
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">{`${shipment.recipient_first_name || ''} ${shipment.recipient_last_name || ''}`.trim() || 'N/A'}</p>
                      </td>

                      {/* Progression - basée sur le statut */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-[#E8B44D] h-2 rounded-full transition-all"
                              style={{
                                width: `${shipment.status === 'DEPOT' ? 20 :
                                  shipment.status === 'PRISE_EN_CHARGE' ? 40 :
                                    shipment.status === 'EN_COURS_LIVRAISON' ? 60 :
                                      shipment.status === 'RECUPERE' ? 80 :
                                        shipment.status === 'LIVRE' ? 100 : 0
                                  }%`
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">
                            {
                              shipment.status === 'DEPOT' ? '1/5' :
                                shipment.status === 'PRISE_EN_CHARGE' ? '2/5' :
                                  shipment.status === 'EN_COURS_LIVRAISON' ? '3/5' :
                                    shipment.status === 'RECUPERE' ? '4/5' :
                                      shipment.status === 'LIVRE' ? '5/5' : '0/5'
                            }
                          </span>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="py-4 px-6">
                        {getStatusBadge(shipment.status)}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600">
                          {shipment.created_at ? new Date(shipment.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setShowDetails(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Eye className="h-5 w-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Aucun colis trouvé</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

