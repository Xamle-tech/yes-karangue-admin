import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import ShipperForm from '../../components/forms/ShipperForm';

export default function ShippersPage() {
  const [shippers, setShippers] = useState([
    {
      id: 1,
      name: 'Entreprise ABC',
      email: 'contact@abc.com',
      phone: '+221 77 123 45 67',
      address: 'Dakar, Sénégal',
      registrationNumber: 'SN123456',
      status: 'active',
      joinDate: '2025-01-15',
    },
    {
      id: 2,
      name: 'Commerce XYZ',
      email: 'info@xyz.com',
      phone: '+221 78 987 65 43',
      address: 'Thiès, Sénégal',
      registrationNumber: 'SN654321',
      status: 'active',
      joinDate: '2025-01-10',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingShipper, setEditingShipper] = useState(null);

  const filteredShippers = shippers.filter(
    (shipper) =>
      shipper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddShipper = (formData) => {
    if (editingShipper) {
      setShippers(
        shippers.map((s) => (s.id === editingShipper.id ? { ...s, ...formData } : s))
      );
      setEditingShipper(null);
    } else {
      setShippers([
        ...shippers,
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

  const handleDeleteShipper = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet expéditeur?')) {
      setShippers(shippers.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expéditeurs</h1>
          <p className="text-gray-600 mt-1">Gérez les expéditeurs inscrits</p>
        </div>
        <button
          onClick={() => {
            setEditingShipper(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#305669] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" />
          Ajouter un expéditeur
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ShipperForm
          shipper={editingShipper}
          onSubmit={handleAddShipper}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un expéditeur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
        />
      </div>

      {/* Shippers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Téléphone
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
            {filteredShippers.map((shipper) => (
              <tr key={shipper.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {shipper.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{shipper.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{shipper.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      shipper.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {shipper.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingShipper(shipper);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                      title="Modifier"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteShipper(shipper.id)}
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
      {filteredShippers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">Aucun expéditeur trouvé</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{shippers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600">
            {shippers.filter((s) => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Ce mois</p>
          <p className="text-2xl font-bold text-blue-600">
            {shippers.filter((s) => s.joinDate.startsWith(new Date().getFullYear())).length}
          </p>
        </div>
      </div>
    </div>
  );
}
