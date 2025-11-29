import { useState } from 'react';
import { Plus, Search, Package, MapPin, Clock, User, Download } from 'lucide-react';
import AgentShipmentForm from '../../components/forms/AgentShipmentForm';
import ShipmentStatusUpdate from '../../components/modals/ShipmentStatusUpdate';
import ReceiveShipmentModal from '../../components/modals/ReceiveShipmentModal';

export default function AgentDashboardPage() {
  const [shipments, setShipments] = useState([
    {
      id: 'YK-2025-00001',
      trackingNumber: 'TRK001',
      shipper: 'Entreprise ABC',
      recipient: 'Client XYZ',
      recipientPhone: '+221 77 123 45 67',
      status: 1, // 1=Dépôt, 2=Prise en charge, 3=En cours, 4=Au point, 5=Remis
      description: 'Colis électronique',
      weight: 2.5,
      origin: 'Dakar',
      destination: 'Thiès',
      createdAt: '2025-01-15T10:30:00Z',
      stampFee: 5000,
      stampStatus: 'paid',
    },
    {
      id: 'YK-2025-00002',
      trackingNumber: 'TRK002',
      shipper: 'Commerce XYZ',
      recipient: 'Client ABC',
      recipientPhone: '+221 78 987 65 43',
      status: 2,
      description: 'Documents importants',
      weight: 1.2,
      origin: 'Thiès',
      destination: 'Kaolack',
      createdAt: '2025-01-14T10:30:00Z',
      stampFee: 3500,
      stampStatus: 'paid',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddShipment = (formData) => {
    setShipments([
      ...shipments,
      {
        id: `YK-2025-${String(shipments.length + 1).padStart(5, '0')}`,
        trackingNumber: `TRK${String(shipments.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 1, // Commence toujours à "Dépôt"
        createdAt: new Date().toISOString(),
        stampStatus: 'paid',
      },
    ]);
    setShowForm(false);
  };

  const handleUpdateStatus = (shipmentId, newStatus) => {
    setShipments(
      shipments.map((s) => (s.id === shipmentId ? { ...s, status: newStatus } : s))
    );
    setShowStatusUpdate(false);
    setSelectedShipment(null);
  };

  const handleReceiveShipment = (shipment) => {
    // Passer au statut 4 (Au point)
    setShipments(
      shipments.map((s) =>
        s.id === shipment.id ? { ...s, status: 4 } : s
      )
    );
    setShowReceive(false);
  };

  const getStatusLabel = (status) => {
    const labels = {
      1: 'Dépôt',
      2: 'Prise en charge',
      3: 'En cours',
      4: 'Au point',
      5: 'Remis',
    };
    return labels[status] || 'Inconnu';
  };

  const getStatusColor = (status) => {
    const colors = {
      1: 'bg-gray-100 text-gray-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Espace Agent - Gestion des Colis
          </h1>
          <p className="text-gray-600 mt-1">
            Déposez et recevez les colis à votre point de retrait
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReceive(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
          >
            <Download className="h-5 w-5" />
            Réception de Colis
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Dépôt de Colis
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <AgentShipmentForm
          onSubmit={handleAddShipment}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Status Update Modal */}
      {showStatusUpdate && selectedShipment && (
        <ShipmentStatusUpdate
          shipment={selectedShipment}
          onUpdate={handleUpdateStatus}
          onClose={() => {
            setShowStatusUpdate(false);
            setSelectedShipment(null);
          }}
        />
      )}

      {/* Receive Shipment Modal */}
      {showReceive && (
        <ReceiveShipmentModal
          onClose={() => setShowReceive(false)}
          onReceive={handleReceiveShipment}
          shipments={shipments}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total colis</p>
          <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-gray-600">
            {shipments.filter((s) => s.status === 1).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Pris en charge</p>
          <p className="text-2xl font-bold text-blue-600">
            {shipments.filter((s) => s.status === 2).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">En cours</p>
          <p className="text-2xl font-bold text-yellow-600">
            {shipments.filter((s) => s.status === 3).length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par ID, numéro de suivi ou destinataire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
        />
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-[#305669]" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{shipment.id}</p>
                    <p className="text-sm text-gray-500">
                      Suivi: {shipment.trackingNumber}
                    </p>
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  shipment.status
                )}`}
              >
                {getStatusLabel(shipment.status)}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Expéditeur</p>
                <p className="font-medium text-gray-900">{shipment.shipper}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Destinataire</p>
                <p className="font-medium text-gray-900">{shipment.recipient}</p>
                <p className="text-xs text-gray-600">{shipment.recipientPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-medium text-gray-900">{shipment.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Poids</p>
                <p className="font-medium text-gray-900">{shipment.weight} kg</p>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{shipment.origin}</span>
                  {' → '}
                  <span className="font-semibold text-gray-900">
                    {shipment.destination}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            {shipment.status <= 3 && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedShipment(shipment);
                    setShowStatusUpdate(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition"
                >
                  Mettre à jour le statut
                </button>
              </div>
            )}
            {shipment.status > 3 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Colis livré - Mis à jour automatiquement par le système
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredShipments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Aucun colis trouvé</p>
        </div>
      )}
    </div>
  );
}

