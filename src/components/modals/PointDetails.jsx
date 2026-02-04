import { ArrowLeft, Edit2, Trash2, MapPin, Phone, Mail, Users, Package, Calendar } from 'lucide-react';

export default function PointDetails({ point, onBack, onEdit, onDelete }) {
  if (!point) return null;

  const getTypeLabel = (type) => {
    const labels = {
      depot: 'Dépôt',
      retrait: 'Retrait',
      both: 'Dépôt & Retrait',
      // API might return standard values
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'DEPOT_RETRAIT': 'Dépôt & Retrait'
    };
    return labels[type] || type;
  };

  // Données réelles (API renvoie agents_count et parcels_count)
  const activeAgents = Number(point.agents_count ?? point.agents) || 0;
  const processedParcels = Number(point.parcels_count ?? point.shipmentsProcessed ?? point.shipments_count) || 0;

  const getManagerName = (point) => {
    if (point.manager_name) return point.manager_name;
    if (typeof point.manager === 'object' && point.manager !== null) {
      return `${point.manager.firstName || ''} ${point.manager.lastName || ''}`.trim() || point.manager.email || 'Admin';
    }
    if (typeof point.manager === 'string') return point.manager;
    return 'Non assigné';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="cursor-pointer hover:text-gray-700" onClick={onBack}>Points de Retrait</span>
            <span>{'>'}</span>
            <span className="text-gray-900 font-medium">Point N° {point.id}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{point.name}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B44D] text-white rounded-full font-medium hover:bg-[#D9A53C] transition shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
            <span>Modifier</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 bg-red-50 rounded-full font-medium hover:bg-red-100 transition shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Info Column (Left) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status & Type Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800`}>
                {getTypeLabel(point.type)}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${point.is_active || point.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {point.is_active || point.status === 'Actif' ? 'Actif' : 'Inactif'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations générales</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-900">{point.email || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-900">{point.main_phone || point.phone || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-900">{point.address}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                <Calendar className="h-4 w-4" />
                <p>Date de création <span className="text-[#305669] font-medium ml-auto float-right">{new Date(point.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span></p>
              </div>
            </div>
          </div>

          {/* Manager Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gestionnaire</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#E5F6FD] flex items-center justify-center text-[#305669]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{getManagerName(point)}</p>
                <p className="text-sm text-gray-500">{point.managerPhone || 'N/A'}</p>
                {/* Note: ID not shown here in design, usually just name/phone */}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{point.managerPhone || point.manager_user_id || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Stats & Hours Column (Right/Center) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Agents assignés</p>
                <p className="text-4xl font-bold text-gray-900">{activeAgents}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Colis traités</p>
                <p className="text-4xl font-bold text-gray-900">{processedParcels}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[#FFF9EB] flex items-center justify-center">
                <Package className="h-6 w-6 text-[#E8B44D]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


