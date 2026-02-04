import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, LayoutGrid, List as ListIcon, ChevronDown, Truck, Bike, Car, Download, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import TransporterForm from '../../components/forms/TransporterForm';
import TransporterDetails from '../../components/TransporterDetails';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import SuccessModal from '../../components/modals/SuccessModal';
import { fetchTransporters, createTransporter, updateTransporter, deleteTransporter, fetchTransportersStatistics } from '../../services/transporterService';
import Toast from '../../components/Toast';

// Formater les revenus (FCFA) pour l'affichage
const formatEarnings = (value) => {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M F`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K F`;
  return `${n} F`;
};

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
  const [viewingTransporter, setViewingTransporter] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [transporterStats, setTransporterStats] = useState({
    by_station: [],
    by_vehicle_type: [],
    total_transporters: 0,
    total_courses: 0,
    courses_en_moyenne: 0,
    total_revenue_fcfa: 0,
  });

  // Couleurs pour le graphique par type de véhicule
  const VEHICLE_COLORS = ['#4CAF50', '#E8B44D', '#5B9BAD', '#F44336', '#9E9E9E', '#2196F3', '#FF9800'];

  const [deleteModal, setDeleteModal] = useState({ show: false, transporterId: null, transporterName: '' });
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTransporters = async () => {
    try {
      setLoading(true);
      setError(null);
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

  const loadStats = async () => {
    try {
      const data = await fetchTransportersStatistics();
      setTransporterStats({
        by_station: Array.isArray(data.by_station) ? data.by_station : [],
        by_vehicle_type: Array.isArray(data.by_vehicle_type) ? data.by_vehicle_type : [],
        total_transporters: Number(data.total_transporters) || 0,
        total_courses: Number(data.total_courses) || 0,
        courses_en_moyenne: Number(data.courses_en_moyenne) || 0,
        total_revenue_fcfa: Number(data.total_revenue_fcfa) || 0,
      });
    } catch (err) {
      console.error('Erreur stats transporteurs:', err);
      setTransporterStats({
        by_station: [],
        by_vehicle_type: [],
        total_transporters: 0,
        total_courses: 0,
        courses_en_moyenne: 0,
        total_revenue_fcfa: 0,
      });
    }
  };

  useEffect(() => {
    loadTransporters();
    loadStats();
  }, []);

  const filteredTransporters = transporters.filter(
    (transporter) =>
      (transporter.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transporter.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveTransporter = async (formData) => {
    try {
      if (editingTransporter) {
        await updateTransporter(editingTransporter.id, formData);
        setSuccessModal({ show: true, message: 'Informations mis à jour avec succès.' });
      } else {
        await createTransporter(formData);
        setSuccessModal({ show: true, message: 'Transporteur crée avec succès.' });
      }

      // Delay closing form until success modal is closed/acknowledged?
      // Or close form immediately behind the modal?
      // Usually better to keep form or switch to list. 
      // User requirement: "popup de confirmation".
      setShowForm(false);
      setEditingTransporter(null);
      loadTransporters();
      loadStats();
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
      loadStats();
      // Use success modal for delete too? "popup de confirmationen cas de reussite des endpoint". Assume yes.
      // But maybe the deletion is quick. I'll stick to Toast for deletion unless asked, but user said "endpoints" plural.
      // Image only showed Create/Update messages. I'll stick to toast for delete for now or check if there was a delete success image. 
      // There is only "Update" (green check) and "Create" (green check) images.
      // However the prompt says "Ajouter les popup de confirmationen cas de reussite des endpoint".

      setDeleteModal({ show: false, transporterId: null, transporterName: '' });
      loadTransporters();
      setSuccessModal({ show: true, message: 'Transporteur supprimé avec succès.' });
      // If we were viewing details of deleted item, go back to list
      if (viewingTransporter && viewingTransporter.id === deleteModal.transporterId) {
        setViewingTransporter(null);
      }
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

  // Statistiques : données réelles (transporteurs actifs, course en moyenne, revenus)
  const stats = {
    active: transporters.filter(t => t.status === 'active').length.toString(),
    coursesEnMoyenne: transporterStats.courses_en_moyenne,
    earnings: transporterStats.total_revenue_fcfa >= 1_000_000
      ? `${(transporterStats.total_revenue_fcfa / 1_000_000).toFixed(1)}M`
      : transporterStats.total_revenue_fcfa >= 1_000
        ? `${Math.floor(transporterStats.total_revenue_fcfa / 1_000)}K`
        : String(transporterStats.total_revenue_fcfa),
  };

  // Conditional Rendering for Form View
  if (showForm) {
    return (
      <div className="h-full">
        <TransporterForm
          transporter={editingTransporter}
          onSubmit={handleSaveTransporter}
          onClose={() => setShowForm(false)}
        />
        {/* Render SuccessModal here if needed, but it might be better at top level. 
            If I handle success inside handleSave, I set showForm(false) immediately.
            Then this block exits, and we return standard view.
            So standard view must render SuccessModal.
        */}
      </div>
    );
  }

  if (viewingTransporter) {
    return (
      <div className="h-full">
        <TransporterDetails
          transporter={viewingTransporter}
          onBack={() => setViewingTransporter(null)}
          onEdit={(t) => {
            setViewingTransporter(null);
            setEditingTransporter(t);
            setShowForm(true);
          }}
          onDelete={(t) => confirmDeleteTransporter(t)}
        />
      </div>
    );
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
          className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-full hover:bg-[#D9A53C] transition font-medium shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Ajouter un transporteur
        </button>
      </div>

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

        {/* Course en moyenne */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Course en moyenne</p>
            <p className="text-3xl font-bold text-gray-900">{stats.coursesEnMoyenne}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFF9EB] flex items-center justify-center">
            <Truck className="h-6 w-6 text-[#E8B44D]" />
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
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Livraisons</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Revenus</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Chargement...</td></tr>
              ) : filteredTransporters.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Aucun transporteur trouvé</td></tr>
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{transporter.deliveries_count ?? 0}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatEarnings(transporter.total_earnings ?? transporter.total_earnings_fcfa ?? 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${transporter.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {transporter.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewingTransporter(transporter)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => {
                            setEditingTransporter(transporter);
                            setShowForm(true);
                          }} className="p-1.5 text-[#E8B44D] hover:bg-[#FFF9EB] rounded-lg transition">
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

        {/* Pagination - Reuse existing */}
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

      {/* Charts Section - données réelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Transporteurs par point relais */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transporteurs par point relais</h3>
          <div className="h-[250px] w-full">
            {transporterStats.by_station.length === 0 ? (
              <p className="text-gray-500 text-sm flex items-center justify-center h-full">Aucune donnée</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transporterStats.by_station.map((s) => ({ name: s.station_name || 'Non assigné', value: s.count }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#F9FAFB' }} />
                  <Bar dataKey="value" fill="#E8B44D" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart: Transporteurs par type de véhicule */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transporteurs par type de véhicule</h3>
          <div className="h-[250px] w-full flex items-center">
            {transporterStats.by_vehicle_type.length === 0 ? (
              <p className="text-gray-500 text-sm flex items-center justify-center w-full h-full">Aucune donnée</p>
            ) : (
              (() => {
                const pieData = transporterStats.by_vehicle_type.map((v, i) => ({
                  name: (v.vehicle_type || 'Autre').replace(/_/g, ' '),
                  value: v.count,
                  color: VEHICLE_COLORS[i % VEHICLE_COLORS.length],
                }));
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#6B7280' }} />
                    </PieChart>
                  </ResponsiveContainer>
                );
              })()
            )}
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

      {successModal.show && (
        <SuccessModal
          message={successModal.message}
          onClose={() => setSuccessModal({ show: false, message: '' })}
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
