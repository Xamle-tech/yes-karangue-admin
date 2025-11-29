import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  // Mock data
  const stats = [
    { icon: Package, label: 'Colis en transit', value: 24, change: '+12%', color: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600' },
    { icon: Users, label: 'Utilisateurs actifs', value: 1248, change: '+8%', color: 'from-green-50 to-green-100', iconColor: 'text-green-600' },
    { icon: DollarSign, label: 'Revenus ce mois', value: '2.4M FCFA', change: '+15%', color: 'from-purple-50 to-purple-100', iconColor: 'text-purple-600' },
    { icon: AlertCircle, label: 'Problèmes signalés', value: 3, change: '-2%', color: 'from-red-50 to-red-100', iconColor: 'text-red-600' },
  ];

  const chartData = [
    { month: 'Jan', colis: 65, utilisateurs: 240 },
    { month: 'Fév', colis: 78, utilisateurs: 310 },
    { month: 'Mar', colis: 95, utilisateurs: 380 },
    { month: 'Avr', colis: 112, utilisateurs: 450 },
    { month: 'Mai', colis: 145, utilisateurs: 520 },
    { month: 'Juin', colis: 168, utilisateurs: 630 },
  ];

  const statusData = [
    { name: 'Livré', value: 45, color: '#10B981' },
    { name: 'En transit', value: 30, color: '#3B82F6' },
    { name: 'En attente', value: 15, color: '#F59E0B' },
    { name: 'Annulé', value: 10, color: '#EF4444' },
  ];

  const recentShipments = [
    {
      id: 'YK-2025-00001',
      from: 'Dakar',
      to: 'Thiès',
      status: 'in_transit',
      stamp: 'pending',
      time: 'Il y a 2h',
    },
    {
      id: 'YK-2025-00002',
      from: 'Thiès',
      to: 'Kaolack',
      status: 'delivered',
      stamp: 'paid',
      time: 'Il y a 4h',
    },
    {
      id: 'YK-2025-00003',
      from: 'Kaolack',
      to: 'Saint-Louis',
      status: 'pending',
      stamp: 'paid',
      time: 'Il y a 6h',
    },
  ];

  const topTransporters = [
    { name: 'Transport ABC', deliveries: 245, rating: 4.8 },
    { name: 'Logistique XYZ', deliveries: 198, rating: 4.6 },
    { name: 'Express Sénégal', deliveries: 167, rating: 4.7 },
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      in_transit: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      delivered: 'Livré',
      in_transit: 'En transit',
      pending: 'En attente',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600 mt-1">
          Bienvenue, Admin! Voici un aperçu de votre plateforme.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-lg border border-gray-200 p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white ${stat.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Activité mensuelle</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="colis"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Colis"
              />
              <Line
                type="monotone"
                dataKey="utilisateurs"
                stroke="#10B981"
                strokeWidth={2}
                name="Utilisateurs"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Distribution des statuts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Shipments & Top Transporters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Colis récents</h2>
            <a href="/shipments" className="text-[#305669] text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-3">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#305669] transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{shipment.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {shipment.from} → {shipment.to}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {getStatusLabel(shipment.status)}
                  </span>
                  {shipment.stamp === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      Timbre
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Transporters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Meilleurs transporteurs</h2>
            <a href="/transporters" className="text-[#305669] text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-3">
            {topTransporters.map((transporter, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#305669] transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{transporter.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {transporter.deliveries} livraisons
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      {transporter.rating}
                    </span>
                    <span className="text-yellow-400">⭐</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Serveurs actifs</p>
          <p className="text-2xl font-bold text-green-600 mt-2">4/4</p>
          <p className="text-xs text-gray-500 mt-1">Tous les serveurs fonctionnent correctement</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Temps de réponse API</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">127 ms</p>
          <p className="text-xs text-gray-500 mt-1">Performance optimale</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Espace de stockage</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">65%</p>
          <p className="text-xs text-gray-500 mt-1">2.6 TB utilisés sur 4 TB</p>
        </div>
      </div>
    </div>
  );
}
