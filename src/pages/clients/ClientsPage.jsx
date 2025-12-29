import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, User, Smartphone, LayoutGrid, List as ListIcon } from 'lucide-react';
import ClientForm from '../../components/forms/ClientForm';
import ClientDetails from '../../components/modals/ClientDetails';

export default function ClientsPage() {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Ahmed Diallo',
      initials: 'AD',
      role: 'Exp. & Dest.',
      email: 'contact@abc-transport.com',
      phone: '+221 77 123 45 67',
      hasApp: true,
      lastActivity: '06/12/2025',
      status: 'Actif',
      activityHistory: [],
    },
    {
      id: 2,
      name: 'Fatou Sall',
      initials: 'FS',
      role: 'Destinataire',
      email: 'info@logistique-xyz.com',
      phone: '+221 78 987 65 43',
      hasApp: false,
      lastActivity: '05/12/2025',
      status: 'Actif',
      activityHistory: [],
    },
    {
      id: 3,
      name: 'Boutique Électronique Dakar',
      initials: 'BD',
      role: 'Expéditeur',
      email: 'support@express-senegal.com',
      phone: '+221 76 555 44 33',
      hasApp: true,
      lastActivity: '05/12/2025',
      status: 'Actif',
      activityHistory: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const filteredClients = clients.filter((client) => {
    return (
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  });

  const handleAddClient = (formData) => {
    // ... logic mostly same, simplified for UI demo
    setShowForm(false);
  };

  const handleDeleteClient = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client?')) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const stats = {
    total: clients.length,
    withApp: clients.filter((c) => c.hasApp).length,
    withoutApp: clients.filter((c) => !c.hasApp).length,
    totalShipments: 72, // Hardcoded for demo match or calculated
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
          className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-lg hover:bg-[#D9A53C] transition font-medium shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Ajouter un client
        </button>
      </div>

      {/* Form/Modal Logic */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={handleAddClient}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Clients */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-2">Ce mois</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Avec app */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avec app</p>
              <p className="text-3xl font-bold text-gray-900">{stats.withApp}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span className="font-bold">↗ 67%</span> des clients
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Smartphone className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Sans app */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sans app</p>
              <p className="text-3xl font-bold text-gray-900">{stats.withoutApp}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span className="font-bold">↗ +2%</span> Ce mois
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total colis */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total colis</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalShipments}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span className="font-bold">↗ +2%</span> Ce mois
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
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
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
              <span>Tous les statuts</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Téléphone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">App</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Activité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client, index) => (
                <tr
                  key={client.id}
                  className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 font-bold text-sm relative">
                        {client.initials}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-6 py-4">
                    {client.hasApp ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        <Smartphone className="h-3 w-3" />
                        Oui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.lastActivity}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-[#E8B44D] transition">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">éléments par page: </span>
              <select className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm bg-white">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span>1 - 1 sur 3</span>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded transition disabled:opacity-50">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

