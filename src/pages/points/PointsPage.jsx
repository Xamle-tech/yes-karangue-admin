import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Users, Package, Eye, LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react';
import PointForm from '../../components/forms/PointForm';
import PointDetails from '../../components/modals/PointDetails';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import Toast from '../../components/Toast';
import { fetchRelayPoints, deleteRelayPoint, createRelayPoint, updateRelayPoint } from '../../services/relayPointService';
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';

export default function PointsPage() {
  // States: 'list', 'create', 'edit', 'details'
  const [viewMode, setViewMode] = useState('list');
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null); // Pour 'edit' et 'details'
  const [filterType, setFilterType] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pointToDelete, setPointToDelete] = useState(null);
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });

  // ... (rest of the component logic) ...



  // Charger les points de retrait
  const loadRelayPoints = async () => {
    try {
      setLoading(true);
      const params = {};

      if (searchTerm) params.q = searchTerm;
      if (filterType) params.type = filterType;

      const data = await fetchRelayPoints(params);
      setPoints(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Erreur chargement:', error);
      setToast({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et quand les filtres changent
  useEffect(() => {
    loadRelayPoints();
  }, [searchTerm, filterType]);

  const filteredPoints = points;

  const stats = {
    total: points.length,
    active: points.filter((p) => p.is_active || p.status === 'Actif').length,
    agents: points.reduce((acc, curr) => acc + (curr.agents || 0), 0),
    shipments: points.reduce((acc, curr) => acc + (curr.shipmentsProcessed || curr.shipments_count || 0), 0),
  };

  const handleAddPoint = async (formData) => {
    try {
      await createRelayPoint(formData);
      setSuccessModal({
        show: true,
        message: 'Points de Retrait crée avec succès.'
      });
      setViewMode('list');
      await loadRelayPoints();
    } catch (error) {
      throw error; // Propagate to form
    }
  };

  const handleUpdatePoint = async (formData) => {
    try {
      await updateRelayPoint(selectedPoint.id, formData);
      setSuccessModal({
        show: true,
        message: 'Informations mis à jour avec succès.'
      });
      setViewMode('list');
      setSelectedPoint(null);
      await loadRelayPoints();
    } catch (error) {
      throw error; // Propagate to form
    }
  };

  const confirmDelete = (point) => {
    setPointToDelete(point);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!pointToDelete) return;

    setDeletingId(pointToDelete.id);
    try {
      await deleteRelayPoint(pointToDelete.id);

      // Close delete modal first
      setShowDeleteModal(false);

      setSuccessModal({
        show: true,
        message: `Point "${pointToDelete.name}" a été supprimé.`
      });

      if (viewMode === 'details') {
        setViewMode('list');
      }

      await loadRelayPoints();
    } catch (error) {
      console.error('Erreur suppression:', error);
      // Show error modal instead of toast
      setErrorModal({ show: true, message: error.message });
    } finally {
      setDeletingId(null);
      // Delete modal is closed in try block to show success modal immediately
      if (showDeleteModal) setShowDeleteModal(false);
      setPointToDelete(null);
    }
  };

  const handleEditClick = (point) => {
    setSelectedPoint(point);
    setViewMode('edit');
  };

  const handleDetailsClick = (point) => {
    setSelectedPoint(point);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPoint(null);
  };

  const getManagerName = (point) => {
    // Priority: manager_name (from form/DB), or manager object properties, or manager string
    if (point.manager_name) return point.manager_name;
    if (typeof point.manager === 'object' && point.manager !== null) {
      return `${point.manager.firstName || ''} ${point.manager.lastName || ''}`.trim() || point.manager.email || 'Admin';
    }
    if (typeof point.manager === 'string') return point.manager;
    return 'Non assigné';
  };

  const getManagerInitials = (point) => {
    const name = getManagerName(point);
    if (name === 'Non assigné') return 'NA';
    return name.substring(0, 2).toUpperCase();
  };

  // Render Views
  if (viewMode === 'create') {
    return (
      <PointForm
        onSubmit={handleAddPoint}
        onCancel={handleBackToList}
      />
    );
  }

  if (viewMode === 'edit') {
    return (
      <PointForm
        point={selectedPoint}
        onSubmit={handleUpdatePoint}
        onCancel={handleBackToList}
      />
    );
  }

  if (viewMode === 'details') {
    return (
      <PointDetails
        point={selectedPoint}
        onBack={handleBackToList}
        onEdit={() => setViewMode('edit')}
        onDelete={() => confirmDelete(selectedPoint)}
      />
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Points de Retrait</h1>
          <p className="text-gray-600 mt-1">Gérez tous les points de retrait et dépôt</p>
        </div>
        <button
          onClick={() => setViewMode('create')}
          className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Ajouter un point
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total points</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <MapPin className="h-6 w-6 text-gray-800" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Actifs</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <div className="h-6 w-6 rounded-full border-4 border-green-500"></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total agents</p>
            <p className="text-3xl font-bold text-blue-600">{stats.agents}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Colis traités</p>
            <p className="text-3xl font-bold text-purple-600">{stats.shipments}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl">
            <Package className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, adresse ou gestionnaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
              <span>Tous les types</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Points Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement des points de retrait...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nom du point</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gestionnaire</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Poids</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type de point</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agents</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Colis</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPoints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Aucun point de retrait trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPoints.map((point, index) => (
                    <tr
                      key={point.id}
                      className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <MapPin className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{point.name}</p>
                            <p className="text-xs text-gray-500">{point.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                            {getManagerInitials(point)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{getManagerName(point)}</p>
                            <p className="text-xs text-gray-500">{point.managerPhone || point.phone || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {point.weight || point.capacity || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {point.type || 'Non défini'}
                        </span>

                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">
                        {point.agents || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-purple-600">
                        {point.shipmentsProcessed || point.shipments_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${point.is_active || point.status === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {point.is_active || point.status === 'Actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDetailsClick(point)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(point)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-[#E8B44D] transition"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(point)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-red-500 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
          <span className="text-sm text-gray-500">1 - {filteredPoints.length} sur {filteredPoints.length}</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Supprimer le point"
          message={`Êtes-vous sûr de vouloir supprimer le point ${pointToDelete?.name} ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={executeDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={deletingId === pointToDelete?.id}
          isDestructive={true}
        />
      )}

      {/* Success Modal */}
      {successModal.show && (
        <SuccessModal
          message={successModal.message}
          onClose={() => setSuccessModal({ show: false, message: '' })}
        />
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <ErrorModal
          message={errorModal.message}
          onClose={() => setErrorModal({ show: false, message: '' })}
        />
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

