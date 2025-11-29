import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, User, Phone, Mail, Smartphone, Activity } from 'lucide-react';
import ClientForm from '../../components/forms/ClientForm';
import ClientDetails from '../../components/modals/ClientDetails';

export default function ClientsPage() {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Ahmed Diallo',
      email: 'ahmed.diallo@mail.com',
      phone: '+221 77 123 45 67',
      address: 'Dakar, Sénégal',
      hasApp: true, // Client a téléchargé l'app
      appDownloadDate: '2025-01-10',
      type: 'both', // shipper, recipient, both
      shipmentsSent: 12,
      shipmentsReceived: 8,
      totalShipments: 20,
      lastActivity: '2025-01-15T14:30:00Z',
      registrationMethod: 'app', // app ou shipment_registration
      status: 'active',
      createdAt: '2025-01-10',
      activityHistory: [
        { date: '2025-01-15', action: 'Reçu un colis', shipmentId: 'YK-2025-00045' },
        { date: '2025-01-14', action: 'Déposé un colis', shipmentId: 'YK-2025-00044' },
        { date: '2025-01-12', action: 'Connexion app', shipmentId: null },
      ],
    },
    {
      id: 2,
      name: 'Fatou Sall',
      email: 'fatou.sall@mail.com',
      phone: '+221 78 987 65 43',
      address: 'Thiès, Sénégal',
      hasApp: false, // Client sans app
      appDownloadDate: null,
      type: 'recipient',
      shipmentsSent: 0,
      shipmentsReceived: 5,
      totalShipments: 5,
      lastActivity: '2025-01-13T10:15:00Z',
      registrationMethod: 'shipment_registration', // Créé lors du dépôt d'un colis
      status: 'active',
      createdAt: '2025-01-08',
      activityHistory: [
        { date: '2025-01-13', action: 'Reçu un colis', shipmentId: 'YK-2025-00035' },
        { date: '2025-01-10', action: 'Reçu un colis', shipmentId: 'YK-2025-00030' },
      ],
    },
    {
      id: 3,
      name: 'Boutique Électronique Dakar',
      email: 'shop@electronics.sn',
      phone: '+221 33 820 45 67',
      address: 'Dakar Centre',
      hasApp: true,
      appDownloadDate: '2024-12-20',
      type: 'shipper',
      shipmentsSent: 45,
      shipmentsReceived: 2,
      totalShipments: 47,
      lastActivity: '2025-01-15T16:45:00Z',
      registrationMethod: 'app',
      status: 'active',
      createdAt: '2024-12-20',
      activityHistory: [
        { date: '2025-01-15', action: 'Déposé 3 colis', shipmentId: 'YK-2025-00040,41,42' },
        { date: '2025-01-13', action: 'Déposé un colis', shipmentId: 'YK-2025-00038' },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [filterApp, setFilterApp] = useState('all'); // all, with_app, without_app

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    const matchesAppFilter =
      filterApp === 'all' ||
      (filterApp === 'with_app' && client.hasApp) ||
      (filterApp === 'without_app' && !client.hasApp);

    return matchesSearch && matchesAppFilter;
  });

  const handleAddClient = (formData) => {
    if (editingClient) {
      setClients(
        clients.map((c) => (c.id === editingClient.id ? { ...c, ...formData } : c))
      );
      setEditingClient(null);
    } else {
      setClients([
        ...clients,
        {
          id: Date.now(),
          ...formData,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          registrationMethod: 'manual_registration',
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDeleteClient = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client?')) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      shipper: 'Expéditeur',
      recipient: 'Destinataire',
      both: 'Exp. & Dest.',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      shipper: 'bg-blue-100 text-blue-800',
      recipient: 'bg-green-100 text-green-800',
      both: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: clients.length,
    withApp: clients.filter((c) => c.hasApp).length,
    withoutApp: clients.filter((c) => !c.hasApp).length,
    totalShipments: clients.reduce((sum, c) => sum + c.totalShipments, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">
            Gérez tous les clients (expéditeurs et destinataires)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" />
          Ajouter un client
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={handleAddClient}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Details Modal */}
      {showDetails && selectedClient && (
        <ClientDetails
          client={selectedClient}
          onClose={() => {
            setShowDetails(false);
            setSelectedClient(null);
          }}
          onEdit={() => {
            setEditingClient(selectedClient);
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total clients</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Avec app</p>
          <p className="text-2xl font-bold text-green-600">{stats.withApp}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((stats.withApp / stats.total) * 100)}% des clients
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Sans app</p>
          <p className="text-2xl font-bold text-orange-600">{stats.withoutApp}</p>
          <p className="text-xs text-gray-500 mt-1">À encourager</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total colis</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalShipments}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterApp('all')}
            className={`px-4 py-2.5 rounded-lg font-medium transition ${
              filterApp === 'all'
                ? 'bg-[#305669] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterApp('with_app')}
            className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
              filterApp === 'with_app'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Avec app
          </button>
          <button
            onClick={() => setFilterApp('without_app')}
            className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
              filterApp === 'without_app'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="h-4 w-4" />
            Sans app
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                App
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Activité
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Colis
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {client.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                      client.type
                    )}`}
                  >
                    {getTypeLabel(client.type)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {client.hasApp ? (
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-700 font-semibold">Oui</span>
                      <span className="text-xs text-gray-500">
                        ({new Date(client.appDownloadDate).toLocaleDateString('fr-FR')})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-orange-600" />
                      <span className="text-xs text-orange-700 font-semibold">Non</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {new Date(client.lastActivity).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">{client.totalShipments}</p>
                    <p className="text-xs text-gray-500">
                      {client.shipmentsSent} envoyés, {client.shipmentsReceived} reçus
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowDetails(true);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                      title="Détails"
                    >
                      <Activity className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingClient(client);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                      title="Modifier"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Aucun client trouvé</p>
        </div>
      )}
    </div>
  );
}

