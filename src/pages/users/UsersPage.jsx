import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import UserForm from '../../components/forms/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Mama Diallo',
      email: 'mama@example.com',
      phone: '+221 77 123 45 67',
      role: 'client',
      pointName: 'Point Dakar Centre',
      location: 'Dakar',
      credits: 15000,
      status: 'active',
      joinDate: '2025-01-01',
    },
    {
      id: 2,
      name: 'Mouhamadou Ba',
      email: 'mouhamadou@example.com',
      phone: '+221 78 234 56 78',
      role: 'point_manager',
      pointName: 'Point Thiès Est',
      location: 'Thiès',
      credits: 0,
      status: 'active',
      joinDate: '2024-12-20',
    },
    {
      id: 3,
      name: 'Fatoumata Sow',
      email: 'fatoumata@example.com',
      phone: '+221 76 345 67 89',
      role: 'admin',
      pointName: null,
      location: null,
      credits: 0,
      status: 'active',
      joinDate: '2024-11-15',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (formData) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      setEditingUser(null);
    } else {
      setUsers([
        ...users,
        {
          id: Date.now(),
          ...formData,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDeleteUser = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      client: 'bg-blue-100 text-blue-800',
      point_manager: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: 'Client',
      point_manager: 'Gestionnaire Point',
      admin: 'Administrateur',
    };
    return labels[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs & Points</h1>
          <p className="text-gray-600 mt-1">
            Gérez les utilisateurs et les points de retrait YES Karangue
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleAddUser}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Utilisateurs total</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Clients</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === 'client').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Points de retrait</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.role === 'point_manager').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Crédits totaux</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.reduce((sum, u) => sum + u.credits, 0).toLocaleString()} FCFA
          </p>
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
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
        >
          <option value="all">Tous les rôles</option>
          <option value="client">Clients</option>
          <option value="point_manager">Points de retrait</option>
          <option value="admin">Administrateurs</option>
        </select>
      </div>

      {/* Users Table */}
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
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Point / Localisation
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {user.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.pointName ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{user.pointName}</p>
                        <p className="text-xs text-gray-500">{user.location}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                      title="Modifier"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
}
