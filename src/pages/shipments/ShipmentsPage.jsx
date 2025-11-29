import { useState } from 'react';
import { Plus, Search, Eye, Download, Printer, AlertCircle } from 'lucide-react';
import ShipmentForm from '../../components/forms/ShipmentForm';
import RouteSheetModal from '../../components/modals/RouteSheetModal';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([
    {
      id: 'YK-2025-00001',
      trackingNumber: 'TRK001',
      shipper: 'Entreprise ABC',
      recipient: 'Client XYZ',
      status: 'pending',
      weight: 2.5,
      description: 'Colis électronique',
      origin: 'Dakar',
      destination: 'Thiès',
      createdAt: '2025-01-15',
      photo: null,
      stampFee: 5000,
      stampStatus: 'pending',
    },
    {
      id: 'YK-2025-00002',
      trackingNumber: 'TRK002',
      shipper: 'Commerce XYZ',
      recipient: 'Client ABC',
      status: 'in_transit',
      weight: 1.2,
      description: 'Documents importants',
      origin: 'Thiès',
      destination: 'Kaolack',
      createdAt: '2025-01-14',
      photo: null,
      stampFee: 3500,
      stampStatus: 'paid',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showRouteSheet, setShowRouteSheet] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editingShipment, setEditingShipment] = useState(null);

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shipper.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddShipment = (formData) => {
    if (editingShipment) {
      setShipments(
        shipments.map((s) =>
          s.id === editingShipment.id ? { ...s, ...formData } : s
        )
      );
      setEditingShipment(null);
    } else {
      setShipments([
        ...shipments,
        {
          id: `YK-2025-${String(shipments.length + 1).padStart(5, '0')}`,
          trackingNumber: `TRK${String(shipments.length + 1).padStart(3, '0')}`,
          ...formData,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          stampStatus: 'pending',
        },
      ]);
    }
    setShowForm(false);
  };

  const handleGenerateRouteSheet = (shipment) => {
    setSelectedShipment(shipment);
    setShowRouteSheet(true);
  };

  const handlePrintRouteSheet = (shipment) => {
    // TODO: Implement print functionality
    window.print();
  };

  const handleConfirmStampPayment = (shipmentId) => {
    setShipments(
      shipments.map((s) =>
        s.id === shipmentId ? { ...s, stampStatus: 'paid' } : s
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      in_transit: 'En transit',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colis</h1>
          <p className="text-gray-600 mt-1">Gérez les colis et générez les feuilles de route</p>
        </div>
        <button
          onClick={() => {
            setEditingShipment(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" />
          Ajouter un colis
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ShipmentForm
          shipment={editingShipment}
          onSubmit={handleAddShipment}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Route Sheet Modal */}
      {showRouteSheet && selectedShipment && (
        <RouteSheetModal
          shipment={selectedShipment}
          onClose={() => setShowRouteSheet(false)}
          onPrint={handlePrintRouteSheet}
        />
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par ID, numéro de suivi ou expéditeur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
        />
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Suivi
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Expéditeur → Destinataire
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Poids
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Timbre
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  <div>
                    <p>{shipment.id}</p>
                    <p className="text-xs text-gray-500 mt-1">{shipment.trackingNumber}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{shipment.shipper}</p>
                  <p className="text-xs text-gray-500 mt-1">→ {shipment.recipient}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{shipment.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{shipment.weight} kg</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {getStatusLabel(shipment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {shipment.stampStatus === 'pending' ? (
                    <button
                      onClick={() => handleConfirmStampPayment(shipment.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-800 text-xs font-semibold rounded-lg hover:bg-yellow-100 transition border border-yellow-200"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      Confirmer
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-lg">
                      Payé
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleGenerateRouteSheet(shipment)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                      title="Feuille de route"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePrintRouteSheet(shipment)}
                      className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                      title="Imprimer"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredShipments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">Aucun colis trouvé</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {shipments.filter((s) => s.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">En transit</p>
          <p className="text-2xl font-bold text-blue-600">
            {shipments.filter((s) => s.status === 'in_transit').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Timbre à confirmer</p>
          <p className="text-2xl font-bold text-orange-600">
            {shipments.filter((s) => s.stampStatus === 'pending').length}
          </p>
        </div>
      </div>
    </div>
  );
}
