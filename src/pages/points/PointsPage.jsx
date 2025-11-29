import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Users, Package } from 'lucide-react';
import PointForm from '../../components/forms/PointForm';
import PointDetails from '../../components/modals/PointDetails';

export default function PointsPage() {
  const [points, setPoints] = useState([
    {
      id: 1,
      name: 'Point Dakar Centre',
      type: 'both', // depot, retrait, both
      address: '123 Rue Blaise Diagne, Dakar',
      phone: '+221 33 XXX XX XX',
      email: 'dakar-centre@yeskarangue.com',
      manager: 'Mouhamadou Ba',
      managerPhone: '+221 77 123 45 67',
      agents: 3,
      shipmentsProcessed: 245,
      status: 'active',
      coordinates: { lat: 14.6928, lng: -17.0467 },
      createdAt: '2025-01-01',
      workingHours: {
        monday: { start: '08:00', end: '18:00', closed: false },
        tuesday: { start: '08:00', end: '18:00', closed: false },
        wednesday: { start: '08:00', end: '18:00', closed: false },
        thursday: { start: '08:00', end: '18:00', closed: false },
        friday: { start: '08:00', end: '18:00', closed: false },
        saturday: { start: '10:00', end: '14:00', closed: false },
        sunday: { start: '00:00', end: '00:00', closed: true },
      },
    },
    {
      id: 2,
      name: 'Point Thiès Est',
      type: 'retrait',
      address: '456 Avenue Lamine Guéye, Thiès',
      phone: '+221 33 YYY YY YY',
      email: 'thies-est@yeskarangue.com',
      manager: 'Aïssatou Diallo',
      managerPhone: '+221 78 987 65 43',
      agents: 2,
      shipmentsProcessed: 156,
      status: 'active',
      coordinates: { lat: 14.7881, lng: -16.3673 },
      createdAt: '2024-12-15',
      workingHours: {
        monday: { start: '08:00', end: '18:00', closed: false },
        tuesday: { start: '08:00', end: '18:00', closed: false },
        wednesday: { start: '08:00', end: '18:00', closed: false },
        thursday: { start: '08:00', end: '18:00', closed: false },
        friday: { start: '08:00', end: '18:00', closed: false },
        saturday: { start: '10:00', end: '14:00', closed: false },
        sunday: { start: '00:00', end: '00:00', closed: true },
      },
    },
    {
      id: 3,
      name: 'Point Kaolack Ouest',
      type: 'depot',
      address: '789 Rue du Marché, Kaolack',
      phone: '+221 33 ZZZ ZZ ZZ',
      email: 'kaolack-ouest@yeskarangue.com',
      manager: 'Ibrahim Sane',
      managerPhone: '+221 76 555 44 33',
      agents: 1,
      shipmentsProcessed: 89,
      status: 'active',
      coordinates: { lat: 13.1667, lng: -15.3167 },
      createdAt: '2024-11-20',
      workingHours: {
        monday: { start: '08:00', end: '17:00', closed: false },
        tuesday: { start: '08:00', end: '17:00', closed: false },
        wednesday: { start: '08:00', end: '17:00', closed: false },
        thursday: { start: '08:00', end: '17:00', closed: false },
        friday: { start: '08:00', end: '17:00', closed: false },
        saturday: { start: '10:00', end: '14:00', closed: false },
        sunday: { start: '00:00', end: '00:00', closed: true },
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [editingPoint, setEditingPoint] = useState(null);

  const filteredPoints = points.filter(
    (point) =>
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPoint = (formData) => {
    if (editingPoint) {
      setPoints(
        points.map((p) => (p.id === editingPoint.id ? { ...p, ...formData } : p))
      );
      setEditingPoint(null);
    } else {
      setPoints([
        ...points,
        {
          id: Date.now(),
          ...formData,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDeletePoint = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce point?')) {
      setPoints(points.filter((p) => p.id !== id));
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      depot: 'Dépôt',
      retrait: 'Retrait',
      both: 'Dépôt & Retrait',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      depot: 'bg-blue-100 text-blue-800',
      retrait: 'bg-green-100 text-green-800',
      both: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Points de Retrait/Dépôt</h1>
          <p className="text-gray-600 mt-1">Gérez tous les points de retrait et dépôt</p>
        </div>
        <button
          onClick={() => {
            setEditingPoint(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" />
          Créer un point
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <PointForm
          point={editingPoint}
          onSubmit={handleAddPoint}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Details Modal */}
      {showDetails && selectedPoint && (
        <PointDetails
          point={selectedPoint}
          onClose={() => {
            setShowDetails(false);
            setSelectedPoint(null);
          }}
          onEdit={() => {
            setEditingPoint(selectedPoint);
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total points</p>
          <p className="text-2xl font-bold text-gray-900">{points.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600">
            {points.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total agents</p>
          <p className="text-2xl font-bold text-blue-600">
            {points.reduce((sum, p) => sum + p.agents, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Colis traités</p>
          <p className="text-2xl font-bold text-purple-600">
            {points.reduce((sum, p) => sum + p.shipmentsProcessed, 0)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, adresse ou gestionnaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
        />
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPoints.map((point) => (
          <div
            key={point.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{point.name}</h3>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                    point.type
                  )}`}
                >
                  {getTypeLabel(point.type)}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  point.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {point.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600">{point.address}</p>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Contact:</span> {point.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Gestionnaire:</span>{' '}
                {point.manager}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Agents</p>
                    <p className="text-lg font-bold text-blue-600">{point.agents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Colis</p>
                    <p className="text-lg font-bold text-purple-600">
                      {point.shipmentsProcessed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedPoint(point);
                  setShowDetails(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition text-sm"
              >
                Détails
              </button>
              <button
                onClick={() => {
                  setEditingPoint(point);
                  setShowForm(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition"
                title="Modifier"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeletePoint(point.id)}
                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPoints.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Aucun point trouvé</p>
        </div>
      )}
    </div>
  );
}

