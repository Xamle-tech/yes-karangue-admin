import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Star, TrendingUp } from 'lucide-react';
import TransporterForm from '../../components/forms/TransporterForm';

export default function TransportersPage() {
  const [transporters, setTransporters] = useState([
    {
      id: 1,
      name: 'Transport ABC',
      email: 'contact@abc-transport.com',
      phone: '+221 77 123 45 67',
      vehicleType: 'Voiture',
      vehicleNumber: 'SN-123-ABC',
      rating: 4.8,
      deliveries: 245,
      totalEarnings: 5200000,
      status: 'active',
      joinDate: '2025-01-10',
    },
    {
      id: 2,
      name: 'Logistique XYZ',
      email: 'info@logistique-xyz.com',
      phone: '+221 78 987 65 43',
      vehicleType: 'Camion',
      vehicleNumber: 'SN-456-XYZ',
      rating: 4.6,
      deliveries: 198,
      totalEarnings: 4150000,
      status: 'active',
      joinDate: '2024-12-15',
    },
    {
      id: 3,
      name: 'Express Sénégal',
      email: 'support@express-senegal.com',
      phone: '+221 76 555 44 33',
      vehicleType: 'Moto',
      vehicleNumber: 'SN-789-EXP',
      rating: 4.7,
      deliveries: 167,
      totalEarnings: 3480000,
      status: 'active',
      joinDate: '2024-11-20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState(null);

  const filteredTransporters = transporters.filter(
    (transporter) =>
      transporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transporter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTransporter = (formData) => {
    if (editingTransporter) {
      setTransporters(
        transporters.map((t) =>
          t.id === editingTransporter.id ? { ...t, ...formData } : t
        )
      );
      setEditingTransporter(null);
    } else {
      setTransporters([
        ...transporters,
        {
          id: Date.now(),
          ...formData,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          rating: 5,
          deliveries: 0,
          totalEarnings: 0,
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDeleteTransporter = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce transporteur?')) {
      setTransporters(transporters.filter((t) => t.id !== id));
    }
  };

  const avgRating =
    transporters.length > 0
      ? (transporters.reduce((sum, t) => sum + t.rating, 0) / transporters.length).toFixed(1)
      : 0;

  const totalEarnings = transporters.reduce((sum, t) => sum + t.totalEarnings, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transporteurs</h1>
          <p className="text-gray-600 mt-1">Gérez les transporteurs et leurs performances</p>
        </div>
        <button
          onClick={() => {
            setEditingTransporter(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" />
          Ajouter un transporteur
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <TransporterForm
          transporter={editingTransporter}
          onSubmit={handleAddTransporter}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Transporteurs actifs</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{transporters.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Note moyenne</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-bold text-yellow-600">{avgRating}</p>
            <span className="text-xl">⭐</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Revenus totaux</p>
          <p className="text-2xl font-bold text-green-600">
            {(totalEarnings / 1000000).toFixed(1)}M FCFA
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un transporteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
        />
      </div>

      {/* Transporters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTransporters.map((transporter) => (
          <div
            key={transporter.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{transporter.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{transporter.vehicleType}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-900">{transporter.rating}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Email:</span> {transporter.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Téléphone:</span>{' '}
                {transporter.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Véhicule:</span>{' '}
                {transporter.vehicleNumber}
              </p>
            </div>

            {/* Performance */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Livraisons</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{transporter.deliveries}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Revenus</p>
                <p className="text-lg font-bold text-green-600">
                  {(transporter.totalEarnings / 1000).toFixed(0)}K
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  transporter.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {transporter.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingTransporter(transporter);
                  setShowForm(true);
                }}
                className="flex-1 p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition font-medium text-sm flex items-center justify-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteTransporter(transporter.id)}
                className="flex-1 p-2 hover:bg-red-50 rounded-lg text-red-600 transition font-medium text-sm flex items-center justify-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransporters.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">Aucun transporteur trouvé</p>
        </div>
      )}
    </div>
  );
}
