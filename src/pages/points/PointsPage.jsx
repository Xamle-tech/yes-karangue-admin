import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Users, Package, Eye, LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react';
import PointForm from '../../components/forms/PointForm';
import PointDetails from '../../components/modals/PointDetails';
import Toast from '../../components/Toast';
import { fetchRelayPoints, deleteRelayPoint, createRelayPoint, updateRelayPoint } from '../../services/relayPointService';

export default function PointsPage() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [editingPoint, setEditingPoint] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [filterType, setFilterType] = useState('');
  const [deletingId, setDeletingId] = useState(null); // Pour afficher le loader pendant la suppression
  const [toast, setToast] = useState(null); // Pour afficher les notifications

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
      alert(error.message);
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

  const handleAddOrUpdatePoint = async (formData) => {
    try {
      if (editingPoint) {
        // Mise à jour d'un point existant
        await updateRelayPoint(editingPoint.id, formData);
        setToast({
          message: `${formData.name} a été modifié avec succès`,
          type: 'success'
        });
      } else {
        // Création d'un nouveau point
        await createRelayPoint(formData);
        setToast({
          message: `${formData.name} a été créé avec succès`,
          type: 'success'
        });
      }

      setShowForm(false);
      setEditingPoint(null);
      await loadRelayPoints();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);

      // Gestion des erreurs avec toast
      let errorMessage = 'Une erreur est survenue';
      let toastType = 'error';

      if (error.message.includes('non trouvé') || error.message.includes('404')) {
        errorMessage = 'Point relais introuvable';
      } else if (error.message.includes('cours d\'utilisation') || error.message.includes('409')) {
        errorMessage = 'Impossible de modifier ce point relais car il est en cours d\'utilisation';
        toastType = 'warning';
      } else if (error.message.includes('validation') || error.message.includes('422')) {
        errorMessage = error.message;
        toastType = 'warning';
      } else {
        errorMessage = error.message;
      }

      setToast({
        message: errorMessage,
        type: toastType
      });

      // Re-lancer l'erreur pour que le formulaire puisse aussi la gérer
      throw error;
    }
  };

  const handleDeletePoint = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce point de retrait?\n\nCette action est irréversible.')) {
      return;
    }

    setDeletingId(id); // Activer le loader
    try {
      await deleteRelayPoint(id);

      // Afficher un message de succès avec toast
      const pointName = points.find(p => p.id === id)?.name || 'Le point relais';
      setToast({
        message: `${pointName} a été supprimé avec succès`,
        type: 'success'
      });

      // Recharger la liste
      await loadRelayPoints();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);

      // Messages d'erreur personnalisés avec toast
      let errorMessage = 'Une erreur est survenue lors de la suppression';
      let toastType = 'error';

      if (error.message.includes('non trouvé') || error.message.includes('404')) {
        errorMessage = 'Point relais introuvable. Il a peut-être déjà été supprimé.';
      } else if (error.message.includes('cours d\'utilisation') || error.message.includes('409')) {
        errorMessage = 'Impossible de supprimer ce point relais car il est actuellement en cours d\'utilisation (colis actifs ou agents assignés).';
        toastType = 'warning';
      } else {
        errorMessage = error.message;
      }

      setToast({
        message: errorMessage,
        type: toastType
      });
    } finally {
      setDeletingId(null); // Désactiver le loader
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Points de Retrait</h1>
          <p className="text-gray-600 mt-1">Gérez tous les points de retrait et dépôt</p>
        </div>
        <button
          onClick={() => {
            setEditingPoint(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Ajouter un point
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <PointForm
          point={editingPoint}
          onSubmit={handleAddOrUpdatePoint}
          onClose={() => {
            setShowForm(false);
            setEditingPoint(null);
          }}
        />
      )}

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

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition ${viewMode === 'grid' ? 'bg-[#E8B44D] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition ${viewMode === 'list' ? 'bg-[#E8B44D] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
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
                            {point.managerInitials || point.manager?.substring(0, 2).toUpperCase() || 'NA'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{point.manager || 'Non assigné'}</p>
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
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPoint(point);
                              setShowForm(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-[#E8B44D] transition"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePoint(point.id)}
                            disabled={deletingId === point.id}
                            className={`p-2 hover:bg-gray-100 rounded-lg transition ${deletingId === point.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-500'
                              }`}
                            title={deletingId === point.id ? 'Suppression en cours...' : 'Supprimer'}
                          >
                            {deletingId === point.id ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
        {/* Pagination placeholder */}
        <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
          <span className="text-sm text-gray-500">1 - {filteredPoints.length} sur {filteredPoints.length}</span>
        </div>
      </div>

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

