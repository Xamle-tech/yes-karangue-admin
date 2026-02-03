import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, MapPin, ChevronDown, LayoutGrid, List as ListIcon, Mail } from 'lucide-react';
import UserForm from '../../components/forms/UserForm';
import UserDetails from '../../components/UserDetails';
import Toast from '../../components/Toast';
import SuccessModal from '../../components/modals/SuccessModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { fetchUsers, deleteUser, resendUserInvitation, createUser, updateUser } from '../../services/userService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRelayPoint, setFilterRelayPoint] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [deletingId, setDeletingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  // Charger les utilisateurs depuis l'API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      if (searchTerm) params.q = searchTerm;
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.status = filterStatus;
      if (filterRelayPoint) params.relay_point_id = filterRelayPoint;

      const data = await fetchUsers(params);

      // Gérer différents formats de réponse
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalItems(data.length);
      } else if (data.data) {
        setUsers(data.data);
        setTotalItems(data.total || data.data.length);
      } else {
        setUsers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      setToast({
        message: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et quand les filtres changent
  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterRole, filterStatus, filterRelayPoint, currentPage, itemsPerPage]);

  // Auto-close Success Modal
  useEffect(() => {
    if (successModal.show) {
      const timer = setTimeout(() => {
        setSuccessModal(prev => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successModal.show]);

  const filteredUsers = users;

  const handleAddUser = async (formData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        setSuccessModal({ show: true, message: 'Informations mis à jour avec succès.' });
      } else {
        await createUser(formData);
        setSuccessModal({ show: true, message: 'Utilisateur crée avec succès.' });
      }
      setShowForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error(error);
      throw error; // Let the form handle the error display or show toast here
    }
  };

  const confirmDeleteUser = (user) => {
    setDeleteModal({
      show: true,
      userId: user.id,
      userName: user.name || user.full_name
    });
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleteModal.userId);
      setDeleteModal({ show: false, userId: null, userName: '' });
      loadUsers();
      // Optional: Show success modal for deletion if needed, but usually toast is fine. 
      // Requirement image 6 says "Supprimer l'utilisateur ...".
      // Wait, is there a success modal for delete? Image 5 is confirmation. 
      // Image 2/4 are success for create/edit. 
      // I'll stick to confirmation + toast for now unless I see a delete success design.
      setToast({
        message: 'Utilisateur supprimé avec succès',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: error.message,
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResendInvitation = async (userId) => {
    try {
      setResendingId(userId);
      await resendUserInvitation(userId);
      setToast({
        message: 'Invitation renvoyée avec succès',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: error.message,
        type: 'error'
      });
    } finally {
      setResendingId(null);
    }
  };

  const adminsCount = users.filter((u) =>
    u.role?.toUpperCase() === 'ADMIN' ||
    u.role?.toUpperCase() === 'SUPER_ADMIN'
  ).length;

  const agentsCount = users.filter((u) =>
    u.role?.toUpperCase() === 'AGENT'
  ).length;

  const renderContent = () => {
    if (showForm) {
      return (
        <UserForm
          user={editingUser}
          onSubmit={handleAddUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      );
    }

    if (viewingUser) {
      return (
        <UserDetails
          user={viewingUser}
          onBack={() => setViewingUser(null)}
          onEdit={(user) => {
            setViewingUser(null);
            setEditingUser(user);
            setShowForm(true);
          }}
          onDelete={(user) => {
            confirmDeleteUser(user);
          }}
        />
      );
    }

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
            className="flex items-center gap-2 bg-[#E8B44D] text-white px-5 py-2.5 rounded-full hover:bg-[#D9A53C] transition font-medium shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Ajouter un utilisateur
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Utilisateurs total */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Utilisateurs total</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Admins</p>
                <p className="text-3xl font-bold text-purple-600">{adminsCount}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Agents */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Agents</p>
                <p className="text-3xl font-bold text-blue-600">{agentsCount}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
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

            {/* Filters */}
            <div className="flex gap-2">
              {/* Status Filter */}
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
                <span>Tous les statuts</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Role Filter */}
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white">
                <span>Tous les rôles</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* View Mode Toggle */}
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

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-[#E8B44D] rounded-full border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Point / Localisation
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      {/* Nom avec avatar et initiales */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
                              {user.initials}
                            </div>
                            {user.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${user.roleColor}`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Téléphone */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.phone}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      {/* Point / Localisation */}
                      <td className="px-6 py-4 text-sm">
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

                      {/* Statut */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${user.statusColor}`}>
                          {user.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Renvoyer l'invitation pour les utilisateurs en attente */}
                          {user.status === 'pending' && (
                            <button
                              onClick={() => handleResendInvitation(user.id)}
                              disabled={resendingId === user.id}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Renvoyer l'invitation"
                            >
                              {resendingId === user.id ? (
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setViewingUser(user)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowForm(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => confirmDeleteUser(user)}
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
          )}

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">éléments par page: </span>
                <select className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span>1 - 1 sur {filteredUsers.length}</span>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-gray-100 rounded transition">
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

        {/* Empty State */}
        {
          filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-600 font-medium">Aucun utilisateur trouvé</p>
            </div>
          )
        }
      </div>
    );
  };

  return (
    <>
      {renderContent()}

      {/* Success Modal */}
      {
        successModal.show && (
          <SuccessModal
            message={successModal.message}
            onClose={() => setSuccessModal({ show: false, message: '' })}
          />
        )
      }

      {/* Delete Confirmation Modal */}
      {
        deleteModal.show && (
          <ConfirmationModal
            title="Supprimer l'utilisateur"
            message={`Êtes-vous sûr de vouloir supprimer l’utilisateur ${deleteModal.userName} ?`}
            confirmText="Supprimer"
            cancelText="Annuler"
            onConfirm={handleDeleteUser}
            onCancel={() => setDeleteModal({ show: false, userId: null, userName: '' })}
            isLoading={isDeleting}
          />
        )
      }
    </>
  );
}
