import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, LayoutGrid, List as ListIcon, ChevronDown, Truck, Bike, Car, Star, Download, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import TransporterForm from '../../components/forms/TransporterForm';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { fetchTransporters, createTransporter, updateTransporter, deleteTransporter } from '../../services/transporterService';
import Toast from '../../components/Toast';

// Fonction utilitaire pour obtenir les initiales
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function TransportersPage() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for charts
  const barChartData = [
    { name: 'Gare Nord', value: 10 },
    { name: 'Gare Sud', value: 8 },
    { name: 'Gare Centrale', value: 5 },
    { name: 'Gare Ouest', value: 3 },
  ];

  const pieChartData = [
    { name: '7 places', value: 45, color: '#4CAF50' },
    { name: 'Minis bus', value: 30, color: '#E8B44D' },
    { name: 'Car rapide', value: 5, color: '#F44336' },
    { name: 'Autres', value: 20, color: '#9E9E9E' },
  ];

  const [deleteModal, setDeleteModal] = useState({ show: false, transporterId: null, transporterName: '' });
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTransporters = async () => {
    try {
      setLoading(true);
      setError(null);
      // Passer le paramètre offset=0 comme demandé
      const data = await fetchTransporters({ offset: 0 });

      const transportersData = Array.isArray(data) ? data : (data.data || []);
      setTransporters(transportersData);
    } catch (error) {
      console.error("❌ Erreur chargement transporteurs:", error);
      setTransporters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransporters();
  }, []);

  const filteredTransporters = transporters.filter(
    (transporter) =>
      (transporter.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transporter.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveTransporter = async (formData) => {
    try {
      if (editingTransporter) {
        await updateTransporter(editingTransporter.id, formData);
        setToast({ message: 'Transporteur mis à jour avec succès', type: 'success' });
      } else {
        await createTransporter(formData);
        setToast({ message: 'Transporteur créé avec succès', type: 'success' });
      }
      setShowForm(false);
      setEditingTransporter(null);
      loadTransporters();
    } catch (error) {
      console.error("Erreur sauvegarde transporteur:", error);
      setToast({ message: error.message || "Erreur lors de l'opération", type: 'error' });
    }
  };

  const confirmDeleteTransporter = (transporter) => {
    setDeleteModal({
      show: true,
      transporterId: transporter.id,
      transporterName: transporter.name
    });
  };

  const handleDeleteTransporter = async () => {
    if (!deleteModal.transporterId) return;

    setIsDeleting(true);
    try {
      await deleteTransporter(deleteModal.transporterId);
      setToast({ message: 'Transporteur supprimé avec succès', type: 'success' });
      setDeleteModal({ show: false, transporterId: null, transporterName: '' });
      loadTransporters();
    } catch (error) {
      console.error("Erreur suppression:", error);
      setToast({ message: error.message || "Impossible de supprimer ce transporteur", type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Car': return <Car className="h-5 w-5" />;
      case 'Truck': return <Truck className="h-5 w-5" />;
      case 'Bike': return <Bike className="h-5 w-5" />;
      default: return <Truck className="h-5 w-5" />;
    }
  }



  // Calcul des statistiques
  const stats = {
    active: transporters.filter(t => t.status === 'active').length.toString(),
    rating: '4.7', // Mocked for design match initially or calc if data exists
    earnings: '12.8M' // Mocked or calc
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
          onSubmit={handleSaveTransporter}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Transporters */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-500 font-medium">Transporteurs actifs</p>
              {/* Avatars pile */}
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">M</div>
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
            <Truck className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Note moyenne</p>
            <p className="text-3xl font-bold text-gray-900">{stats.rating}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFF9EB] flex items-center justify-center">
            <Star className="h-6 w-6 text-[#E8B44D] fill-[#E8B44D]" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Revenus totaux</p>
            <p className="text-3xl font-bold text-gray-900">{stats.earnings} FCFA</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <div className="text-green-600 font-bold text-lg">💵</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un transporteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#E8B44D]/20 transition outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span>Tous les statuts</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            <div className="flex items-center bg-[#E8B44D] rounded-lg p-1">
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white text-[#E8B44D] shadow-sm' : 'text-white/80 hover:bg-white/10'}`}>
                <ListIcon className="h-5 w-5" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white text-[#E8B44D] shadow-sm' : 'text-white/80 hover:bg-white/10'}`}>
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Transporters Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nom du point</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Livraisons</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Revenus</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-500">Chargement...</td></tr>
              ) : filteredTransporters.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-500">Aucun transporteur trouvé</td></tr>
              ) : (
                filteredTransporters.map((transporter) => {
                  const profile = transporter.transporter_profile || {};
                  const vehicleType = profile.vehicle_type || 'Truck'; // Fallback

                  return (
                    <tr key={transporter.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[#E8B44D] bg-[#FFF9EB]`}>
                            {vehicleType === 'Car' ? <Car className="h-5 w-5" /> :
                              vehicleType === 'Bike' ? <Bike className="h-5 w-5" /> :
                                <Truck className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{transporter.name}</p>
                            <p className="text-xs text-gray-500">{vehicleType === 'Car' ? 'Voiture' : vehicleType === 'Bike' ? 'Moto' : 'Camion'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{profile.vehicle_plate || 'SN-XXX-XXX'}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{transporter.phone || '+221 -- --- -- --'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{transporter.email || 'email@example.com'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{transporter.deliveries_count || Math.floor(Math.random() * 300)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{transporter.total_earnings ? `${transporter.total_earnings}F` : `${Math.floor(Math.random() * 5000)}K`}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${transporter.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {transporter.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingTransporter(transporter)} className="p-1.5 text-[#E8B44D] hover:bg-[#FFF9EB] rounded-lg transition">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => confirmDeleteTransporter(transporter)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 mt-4 px-4 pb-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>éléments par page:</span>
            <select className="border-b border-gray-200 bg-transparent py-1 px-2 outline-none focus:border-[#E8B44D]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>1 - 3 sur 3</span>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled><ChevronDown className="h-4 w-4 rotate-90" /></button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50"><ChevronDown className="h-4 w-4 -rotate-90" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transporteurs par gare routière</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F9FAFB' }}
                />
                <Bar dataKey="value" fill="#E8B44D" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transporteurs par type de véhicule</h3>
          <div className="h-[250px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {deleteModal.show && (
        <ConfirmationModal
          onClose={() => setDeleteModal({ show: false, transporterId: null, transporterName: '' })}
          onCancel={() => setDeleteModal({ show: false, transporterId: null, transporterName: '' })}
          onConfirm={handleDeleteTransporter}
          title="Supprimer le transporteur"
          message={`Êtes-vous sûr de vouloir supprimer le transporteur "${deleteModal.transporterName}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          isLoading={isDeleting}
          isDestructive={true}
        />
      )}

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
