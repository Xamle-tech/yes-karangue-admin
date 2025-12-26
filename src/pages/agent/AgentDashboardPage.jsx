import { useState } from 'react';
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
import ShipmentStatusUpdate from '../../components/modals/ShipmentStatusUpdate';
import ReceiveShipmentModal from '../../components/modals/ReceiveShipmentModal';

export default function AgentDashboardPage() {
  const [shipments, setShipments] = useState([
    {
      id: 'YK-2025-05',
      trackingNumber: 'TRK005',
      shipper: 'Entreprise A',
      recipient: 'Client XYZ',
      recipientPhone: '+221 77 123 45 67',
      status: 'Dépôt',
      description: 'Colis électronique',
      weight: 2.5,
      origin: 'Dakar',
      destination: 'Thiès',
      createdAt: '2025-01-15',
      progress: 1,
      totalSteps: 5,
    },
    {
      id: 'YK-2025-04',
      trackingNumber: 'TRK004',
      shipper: 'Commerce Y',
      recipient: 'Client XYZ',
      recipientPhone: '+221 78 987 65 43',
      status: 'Prise en charge',
      description: 'Documents importants',
      weight: 1.2,
      origin: 'Thiès',
      destination: 'Kaolack',
      createdAt: '2025-01-15',
      progress: 2,
      totalSteps: 5,
    },
    {
      id: 'YK-2025-03',
      trackingNumber: 'TRK003',
      shipper: 'Commerce X',
      recipient: 'Client XYZ',
      recipientPhone: '+221 77 555 55 55',
      status: 'En cours de livraison',
      description: 'Documents importants',
      weight: 0.8,
      origin: 'Thiès',
      destination: 'Kaolack',
      createdAt: '2025-01-15',
      progress: 3,
      totalSteps: 5,
    },
    {
      id: 'YK-2025-02',
      trackingNumber: 'TRK002',
      shipper: 'Commerce W',
      recipient: 'Client XYZ',
      recipientPhone: '+221 78 987 65 43',
      status: 'Récupéré',
      description: 'Documents importants',
      weight: 1.2,
      origin: 'Thiès',
      destination: 'Kaolack',
      createdAt: '2025-01-15',
      progress: 4,
      totalSteps: 5,
    },
    {
      id: 'YK-2025-01',
      trackingNumber: 'TRK001',
      shipper: 'Commerce Z',
      recipient: 'Client XYZ',
      recipientPhone: '+221 78 987 65 43',
      status: 'Livré',
      description: 'Documents importants',
      weight: 1.2,
      origin: 'Thiès',
      destination: 'Kaolack',
      createdAt: '2025-01-15',
      progress: 5,
      totalSteps: 5,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

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
        id: `YK-2025-${String(shipments.length + 1).padStart(2, '0')}`,
        trackingNumber: `TRK${String(shipments.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'Dépôt',
        createdAt: new Date().toISOString().split('T')[0],
        progress: 1,
        totalSteps: 5,
      },
    ]);
    setShowForm(false);
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
      'Dépôt': { color: 'bg-gray-100 text-gray-700', icon: '📦' },
      'Prise en charge': { color: 'bg-blue-100 text-blue-700', icon: '📋' },
      'En cours de livraison': { color: 'bg-yellow-100 text-yellow-700', icon: '🚚' },
      'Récupéré': { color: 'bg-purple-100 text-purple-700', icon: '📥' },
      'Livré': { color: 'bg-green-100 text-green-700', icon: '✅' },
    };

    const config = statusConfig[status] || statusConfig['Dépôt'];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.color}`}>
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  const stats = [
    { label: 'Total colis', value: shipments.length.toString().padStart(2, '0'), icon: Package },
    { label: 'En attente', value: shipments.filter(s => s.status === 'Dépôt').length.toString(), icon: Package },
    { label: 'Pris en charge', value: shipments.filter(s => s.status === 'Prise en charge').length.toString(), icon: Package },
    { label: 'En cours', value: shipments.filter(s => s.status === 'En cours de livraison').length.toString(), icon: Package },
  ];

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
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  {/* Colis */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 p-2 rounded-lg">
                        <Package className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{shipment.id}</p>
                        <p className="text-sm text-gray-500">{shipment.origin} → {shipment.destination}</p>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{shipment.description}</p>
                  </td>

                  {/* Expéditeur */}
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{shipment.shipper}</p>
                  </td>

                  {/* Destinataire */}
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{shipment.recipient}</p>
                  </td>

                  {/* Progression */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-[#E8B44D] h-2 rounded-full transition-all"
                          style={{ width: `${(shipment.progress / shipment.totalSteps) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {shipment.progress}/{shipment.totalSteps}
                      </span>
                    </div>
                  </td>

                  {/* Statut */}
                  <td className="py-4 px-6">
                    {getStatusBadge(shipment.status)}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600">{shipment.createdAt}</p>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Eye className="h-5 w-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Aucun colis trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

