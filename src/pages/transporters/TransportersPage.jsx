import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, LayoutGrid, List as ListIcon, ChevronDown, Truck, Bike, Car, Star } from 'lucide-react';
import TransporterForm from '../../components/forms/TransporterForm';
import { fetchTransporters } from '../../services/transporterService';

export default function TransportersPage() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const filteredTransporters = transporters.filter(
    (transporter) =>
      transporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transporter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTransporter = (formData) => {
    // simplified
    setShowForm(false);
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Car': return <Car className="h-5 w-5 text-gray-500" />;
      case 'Truck': return <Truck className="h-5 w-5 text-gray-500" />;
      case 'Bike': return <Bike className="h-5 w-5 text-gray-500" />;
      default: return <Truck className="h-5 w-5 text-gray-500" />;
    }
  }

  const handleDeleteTransporter = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce transporteur?')) {
      setTransporters(transporters.filter((t) => t.id !== id));
    }
  };

  const stats = {
    active: '03',
    rating: '4.8',
    earnings: '12.7M'
  }

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
          className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium shadow-sm"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Transporteurs actifs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <Truck className="h-6 w-6 text-gray-800" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Note moyenne</p>
            <div className="flex items-center gap-1">
              <p className="text-3xl font-bold text-gray-900">{stats.rating}</p>
              <span className="text-xl">⭐</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="h-6 w-6 rounded-full border-2 border-yellow-400"></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Revenus totaux</p>
            <p className="text-3xl font-bold text-green-600">{stats.earnings}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <div className="h-6 w-6 text-green-600 font-bold flex items-center justify-center text-lg">$</div>
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
              placeholder="Rechercher un transporteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
              <span>Tous les status</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p - 2.5 transition ${viewMode === 'grid' ? 'bg-[#E8B44D] text-white' : 'text-gray-600 hover:bg-gray-50'
                  } `}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p - 2.5 transition ${viewMode === 'list' ? 'bg-[#E8B44D] text-white' : 'text-gray-600 hover:bg-gray-50'
                  } `}
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transporters Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement des transporteurs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transporteur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Véhicule</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Téléphone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Livraisons</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Revenus</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransporters.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Aucun transporteur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredTransporters.map((transporter, index) => {
                    const profile = transporter.transporter_profile || {};
                    return (
                      <tr
                        key={transporter.id}
                        className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-xs">
                              {getInitials(transporter.name)}
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">{transporter.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getVehicleIcon(profile.vehicle_type || 'Truck')}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{profile.vehicle_plate || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{profile.vehicle_model || 'Non renseigné'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{transporter.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{transporter.email}</td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">{transporter.deliveries_count || 0}</td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">{transporter.total_earnings || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transporter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {transporter.status || 'Inconnu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-[#E8B44D] transition">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransporter(transporter.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-red-500 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
          <span className="text-sm text-gray-500">1 - 3 sur 3</span>
        </div>
      </div>
    </div>
  );
}
