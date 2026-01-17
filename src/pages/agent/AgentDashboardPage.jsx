import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Package,
  Eye,
  Download,
  Grid3x3,
  List,
  ChevronDown,
  Filter,
  MapPin
} from 'lucide-react';
import boxIcon from '../../icons/box.png';
import proiconsBox from '../../icons/proicons_box.png';
import receiveColis from '../../icons/receive_colis.png';
import AgentShipmentForm from '../../components/forms/AgentShipmentForm';
import AgentShipmentDetails from '../../components/AgentShipmentDetails';
import ShipmentStatusUpdate from '../../components/modals/ShipmentStatusUpdate';
import ReceiveShipmentModal from '../../components/modals/ReceiveShipmentModal';
import ShipmentSuccessModal from '../../components/modals/ShipmentSuccessModal';
import { fetchAgentShipments, createAgentShipment, lookupAgentShipment } from '../../services/agentShipmentsService';

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
  const [isCreating, setIsCreating] = useState(false);

  // Gérer la recherche avec debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        try {
          setLoading(true);
          const data = await lookupAgentShipment(searchTerm);

          let results = [];
          if (data) {
            if (Array.isArray(data)) {
              results = data;
            } else if (data.data) {
              // Si la réponse est paginée ou wrappée dans "data"
              results = Array.isArray(data.data) ? data.data : [data.data];
            } else {
              // Objet unique
              results = [data];
            }
          }

          setShipments(results);
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          setShipments([]);
        } finally {
          setLoading(false);
        }
      } else {
        loadShipments();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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

  // On utilise directement shipments car le filtrage est fait côté serveur
  const filteredShipments = shipments;

  const handleAddShipment = async (formData) => {
    try {
      setIsCreating(true);
      // Importer les services nécessaires dynamiquement
      const { createAgentShipment, downloadWaybillPDF } = await import('../../services/agentShipmentsService');

      // 1. Appeler l'API pour créer le colis
      const newShipment = await createAgentShipment(formData);
      console.log('📦 Colis créé:', newShipment);

      setCreatedShipment(newShipment);

      // 2. Générer et ouvrir la feuille de route si l'ID est disponible
      if (newShipment && newShipment.id) {
        try {
          console.log('📄 Génération de la feuille de route pour le colis:', newShipment.id);
          const pdfBlob = await downloadWaybillPDF(newShipment.id);

          // Créer une URL pour le Blob et l'ouvrir dans un nouvel onglet
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');

          // Nettoyer l'URL après un délai pour libérer la mémoire (optionnel mais recommandé)
          setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 10000);

        } catch (pdfError) {
          console.error('⚠️ Erreur lors de la génération du PDF:', pdfError);
          // On ne bloque pas le flux de succès si le PDF échoue, mais on peut notifier l'utilisateur
          alert('Le colis a été créé mais la feuille de route n\'a pas pu être générée automatiquement.');
        }
      }

      // 3. Recharger la liste des colis
      await loadShipments();

      // 4. Fermer le formulaire et ouvrir le modal de succès
      setShowForm(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('❌ Erreur lors de la création du colis:', error);
      alert('Erreur lors de la création du colis. Veuillez réessayer.');
    } finally {
      setIsCreating(false);
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
    {
      label: 'Total colis',
      value: shipments.length.toString().padStart(2, '0'),
      icon: Package,
      color: 'bg-gray-100 text-gray-900',
      iconColor: 'text-gray-900'
    },
    {
      label: 'En attente',
      value: shipments.filter(s => s.status === 'DEPOT').length.toString(),
      icon: Package,
      color: 'bg-[#FDF4F4] text-[#8E3A3A]',
      iconColor: 'text-[#8E3A3A]'
    },
    {
      label: 'Pris en charge',
      value: shipments.filter(s => s.status === 'PRISE_EN_CHARGE').length.toString(),
      icon: Package,
      color: 'bg-[#EFF8FA] text-[#3B8FAB]',
      iconColor: 'text-[#3B8FAB]'
    },
    {
      label: 'En cours',
      value: shipments.filter(s => s.status === 'EN_COURS_LIVRAISON').length.toString(),
      icon: Package,
      color: 'bg-[#FEF9EA] text-[#DFA527]',
      iconColor: 'text-[#DFA527]'
    },
  ];

  if (showDetails && selectedShipment) {
    return (
      <AgentShipmentDetails
        shipmentId={selectedShipment.id}
        shipment={selectedShipment}
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
            className="flex items-center gap-2 bg-[#5B9BAD] text-white px-6 py-3 rounded-full hover:bg-[#4A8999] transition font-medium shadow-sm"
          >
            <Download className="h-5 w-5" />
            Réception de Colis
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#E8B44D] text-white px-6 py-3 rounded-full hover:bg-[#D9A53C] transition font-medium shadow-sm"
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
          isLoading={isCreating}
        />
      )}

      {showSuccessModal && createdShipment && (
        <ShipmentSuccessModal
          trackingNumber={createdShipment.tracking_number}
          onClose={() => setShowSuccessModal(false)}
          onPrint={async () => {
            try {
              // Importer la fonction si elle n'est pas déjà importée en haut ou dynamiquement
              const { downloadWaybillPDFByTrackingNumber } = await import('../../services/agentShipmentsService');
              const pdfBlob = await downloadWaybillPDFByTrackingNumber(createdShipment.tracking_number);
              const pdfUrl = window.URL.createObjectURL(pdfBlob);
              window.open(pdfUrl, '_blank');
              setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 10000);
            } catch (error) {
              console.error('Erreur impression:', error);
              alert('Impossible de récupérer la lettre de route.');
            }
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
            <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, numéro de suivi ou destinataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#5B9BAD]/50 focus:border-[#5B9BAD] transition-all outline-none bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
              <Filter className="h-4 w-4" />
              <span>Tous les statuts</span>
            </button>

            <div className="flex items-center bg-white p-1 rounded-full border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-full transition ${viewMode === 'list' ? 'bg-[#E8B44D] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-full transition ${viewMode === 'grid' ? 'bg-[#E8B44D] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments List or Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-[#E8B44D] rounded-full border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des colis...</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Aucun colis trouvé</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                {filteredShipments.map((shipment, index) => (
                  <tr
                    key={shipment.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    onClick={() => {
                      setSelectedShipment(shipment);
                      setShowDetails(true);
                    }}
                  >
                    {/* Colis */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-50 p-2 rounded-lg">
                          <img src={boxIcon} alt="Packet" className="h-10 w-10 object-contain" />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShipment(shipment);
                          setShowDetails(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              onClick={() => {
                setSelectedShipment(shipment);
                setShowDetails(true);
              }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer relative"
            >
              {/* Card Header: Icon + Info + Status Text */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-[#F9F5EB] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <img src={boxIcon} alt="Package" className="h-6 w-6 object-contain opacity-80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{shipment.tracking_number}</h3>
                    <p className="text-sm text-gray-400 font-medium">
                      {shipment.created_at ? new Date(shipment.created_at).toLocaleDateString('fr-FR') : 'Date N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  {/* Status Text Only - colored based on status */}
                  <span className={`text-sm font-bold ${shipment.status === 'DEPOT' ? 'text-gray-500' :
                    shipment.status === 'PRISE_EN_CHARGE' ? 'text-[#5B9BAD]' :
                      shipment.status === 'EN_COURS_LIVRAISON' ? 'text-[#E8B44D]' :
                        'text-green-600'
                    }`}>
                    {
                      shipment.status === 'DEPOT' ? 'Dépôt' :
                        shipment.status === 'PRISE_EN_CHARGE' ? 'Prise en charge' :
                          shipment.status === 'EN_COURS_LIVRAISON' ? 'En cours' :
                            shipment.status
                    }
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
                      <p className="font-bold text-gray-900 text-sm">{shipment.sender_city || shipment.sender_address || 'Point Relais'}</p>
                    </div>
                  </div>
                  <span className="text-sm text-[#5B9BAD] font-medium">10:30</span>
                </div>

                {/* Destination */}
                <div className="relative flex justify-between items-start">
                  <div className="flex gap-4">
                    <MapPin className="relative z-10 w-4 h-4 text-[#D32F2F] mt-1" fill="currentColor" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{shipment.recipient_city || shipment.recipient_address || 'Destination'}</p>
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
                      shipment.status === 'DEPOT' ? '1/5' :
                        shipment.status === 'PRISE_EN_CHARGE' ? '2/5' :
                          shipment.status === 'EN_COURS_LIVRAISON' ? '3/5' :
                            shipment.status === 'RECUPERE' ? '4/5' :
                              shipment.status === 'LIVRE' ? '5/5' : '0/5'
                    }
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-[#E8B44D] rounded-full"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - Mock UI based on Image 1 */}
      {filteredShipments.length > 0 && (
        <div className="flex justify-end items-center gap-4 mt-6 text-sm text-gray-500">
          <span>éléments par page: <span className="font-medium text-gray-900 border-b border-gray-300 pb-0.5">10</span></span>
          <span>1 - {filteredShipments.length} sur {filteredShipments.length}</span>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronDown className="h-4 w-4 rotate-90" /></button>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronDown className="h-4 w-4 -rotate-90" /></button>
          </div>
        </div>
      )}
    </div>
  );
}


