import { useState, useEffect } from 'react';
import { Plus, Search, Download, Printer, Check, Package, LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react';
import ShipmentForm from '../../components/forms/ShipmentForm';
import RouteSheetModal from '../../components/modals/RouteSheetModal';
import { fetchTransporters } from '../../services/transporterService';
import { fetchAdminShipments } from '../../services/adminShipmentsService';

const STATUS_LABELS = {
  DEPOT: 'En attente',
  PRISE_EN_CHARGE: 'En transit',
  EN_COURS_DE_LIVRAISON: 'En transit',
  ARRIVE: 'Arrivé',
  LIVRE: 'Livré',
};

function formatStatus(status) {
  return STATUS_LABELS[status] || status || '—';
}

function isPending(status) {
  return status === 'DEPOT';
}
function isTransit(status) {
  return ['PRISE_EN_CHARGE', 'EN_COURS_DE_LIVRAISON', 'ARRIVE'].includes(status);
}
function isDelivered(status) {
  return status === 'LIVRE';
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, transit: 0, delivered: 0, stamp: 0 });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showRouteSheet, setShowRouteSheet] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editingShipment, setEditingShipment] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [transporters, setTransporters] = useState([]);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminShipments({
        q: searchDebounce || undefined,
        per_page: perPage,
        page: currentPage,
      });
      setShipments(Array.isArray(res.data) ? res.data : []);
      setTotal(Number(res.total) || 0);
      setLastPage(Number(res.last_page) || 1);
      setPerPage(Number(res.per_page) || 15);
      if (res.stats) {
        setStats({
          total: Number(res.stats.total) || 0,
          pending: Number(res.stats.pending) || 0,
          transit: Number(res.stats.transit) || 0,
          delivered: Number(res.stats.delivered) || 0,
          stamp: Number(res.stats.stamp) || 0,
        });
      }
    } catch (err) {
      console.error('Erreur chargement colis:', err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [currentPage, perPage, searchDebounce]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const loadTransporters = async () => {
      try {
        const data = await fetchTransporters({ limit: 100 });
        const items = Array.isArray(data) ? data : (data.data || []);
        setTransporters(items.filter(t => t.status === 'active'));
      } catch (err) {
        console.error("Failed to load transporters", err);
      }
    };
    if (showForm) loadTransporters();
  }, [showForm]);

  const handleAddShipment = (formData) => {
    setShowForm(false);
    loadShipments();
  };

  const handleGenerateRouteSheet = (parcel) => {
    setSelectedShipment({
      id: parcel.tracking_number,
      trackingNumber: parcel.tracking_number,
      shipper: [parcel.sender_first_name, parcel.sender_last_name].filter(Boolean).join(' '),
      recipient: [parcel.recipient_first_name, parcel.recipient_last_name].filter(Boolean).join(' '),
      origin: parcel.origin_relay_point?.name || '—',
      destination: parcel.destination_relay_point?.name || '—',
      ...parcel,
    });
    setShowRouteSheet(true);
  };

  const statsDisplay = {
    total: String(stats.total),
    pending: String(stats.pending),
    transit: String(stats.transit),
    stamp: String(stats.stamp),
  };

  if (showForm) {
    return (
      <div className="h-full">
        <ShipmentForm
          shipment={editingShipment}
          transporters={transporters}
          onSubmit={handleAddShipment}
          onClose={() => setShowForm(false)}
        />
      </div>
    );
  }

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
          className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-full hover:bg-[#D9A53C] transition font-medium shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Ajouter un colis
        </button>
      </div>

      {/* Route Sheet Modal */}
      {showRouteSheet && selectedShipment && (
        <RouteSheetModal
          shipment={selectedShipment}
          onClose={() => setShowRouteSheet(false)}
          onPrint={() => window.print()}
        />
      )}

      {/* Stats Cards - données réelles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{statsDisplay.total}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <Package className="h-6 w-6 text-gray-800" strokeWidth={1.5} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">En attente</p>
            <p className="text-3xl font-bold text-gray-900">{statsDisplay.pending}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <Package className="h-6 w-6 text-red-800" strokeWidth={1.5} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">En transit</p>
            <p className="text-3xl font-bold text-gray-900">{statsDisplay.transit}</p>
          </div>
          <div className="p-3 bg-cyan-50 rounded-xl">
            <Package className="h-6 w-6 text-cyan-600" strokeWidth={1.5} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Timbre à confirmer</p>
            <p className="text-3xl font-bold text-gray-900">{statsDisplay.stamp}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-xl">
            <Package className="h-6 w-6 text-yellow-600" strokeWidth={1.5} />
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
              placeholder="Rechercher par numéro de suivi, expéditeur ou destinataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
              <span>Tous les statuts</span>
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

      {/* Shipments Table - données réelles */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement des colis...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Suivi</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Poids</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Timbre</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Date demande</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shipments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Aucun colis trouvé
                      </td>
                    </tr>
                  ) : (
                    shipments.map((parcel) => {
                      const statusLabel = formatStatus(parcel.status);
                      const originName = parcel.origin_relay_point?.name || '—';
                      const destName = parcel.destination_relay_point?.name || '—';
                      const senderName = [parcel.sender_first_name, parcel.sender_last_name].filter(Boolean).join(' ') || '—';
                      const recipientName = [parcel.recipient_first_name, parcel.recipient_last_name].filter(Boolean).join(' ') || '—';
                      return (
                        <tr key={parcel.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#F6F1E6] rounded-lg">
                                <Package className="h-5 w-5 text-[#8B5E34]" strokeWidth={2} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{parcel.tracking_number}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{originName} → {destName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {parcel.content_description || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {parcel.weight_kg != null ? `${Number(parcel.weight_kg)} kg` : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                                isPending(parcel.status)
                                  ? 'bg-gray-200 text-gray-700'
                                  : isTransit(parcel.status)
                                    ? 'bg-orange-50 text-orange-600'
                                    : isDelivered(parcel.status)
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {parcel.stamp_fee_fcfa != null && Number(parcel.stamp_fee_fcfa) > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded">
                                {Number(parcel.stamp_fee_fcfa)} FCFA
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {parcel.created_at
                              ? new Date(parcel.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                              : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleGenerateRouteSheet(parcel)}
                                className="text-[#E8B44D] hover:text-[#D9A53C] transition"
                                title="Imprimer"
                              >
                                <Printer className="h-5 w-5" />
                              </button>
                              <button className="text-[#5B9BAD] hover:text-[#4A899C] transition" title="Télécharger">
                                <Download className="h-5 w-5" />
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
            <div className="border-t border-gray-200 px-6 py-3">
              <div className="flex items-center justify-end text-sm text-gray-600 gap-4">
                <div className="flex items-center">
                  <span className="mr-2">éléments par page:</span>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="border-b border-gray-300 focus:outline-none py-1 bg-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <span>
                  {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, total)} sur {total}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                    className="disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
