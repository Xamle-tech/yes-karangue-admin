import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, ArrowRight, Calendar, Download, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../services/dashboardService';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats('month');
        setDashboardData(data);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Valeurs par défaut ou issues de l'API
  const totalShipments = dashboardData?.total_shipments || 0;
  const pendingShipments = dashboardData?.pending_shipments || 0;
  const deliveredShipments = dashboardData?.delivered_shipments || 0;
  const totalRevenue = dashboardData?.total_revenue || 0;
  const activeUsers = dashboardData?.active_users ?? 0;

  const stats = [
    {
      icon: Package,
      label: 'Colis enrôlés',
      value: pendingShipments + deliveredShipments + (totalShipments - pendingShipments - deliveredShipments), // Approximation ou total réel
      change: '+12%',
      isPositive: true,
      subLabel: 'vs le dernier mois',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-900',
      trendColor: 'text-green-600'
    },
    {
      icon: Package, // Peut-être une icône différente pour "arrivés"
      label: 'Colis arrivés',
      value: deliveredShipments,
      change: '+8%',
      isPositive: true,
      subLabel: 'vs le dernier mois',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trendColor: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Utilisateurs actifs',
      value: activeUsers,
      change: '+8%',
      isPositive: true,
      subLabel: 'clients ayant envoyé au moins un colis',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trendColor: 'text-green-600'
    },
    {
      icon: DollarSign,
      label: 'Revenus ce mois',
      value: totalRevenue >= 1000000 
        ? `${(totalRevenue / 1000000).toFixed(1)}M FCFA`
        : totalRevenue >= 1000
        ? `${(totalRevenue / 1000).toFixed(0)}K FCFA`
        : `${totalRevenue.toFixed(0)} FCFA`,
      change: '+15%',
      isPositive: true,
      subLabel: 'vs le dernier mois',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      trendColor: 'text-green-600'
    },
  ];

  const chartData = [
    { month: 'Jan', colis: 65, utilisateurs: 240 },
    { month: 'Fév', colis: 78, utilisateurs: 310 },
    { month: 'Mar', colis: 95, utilisateurs: 380 },
    { month: 'Avr', colis: 112, utilisateurs: 450 },
    { month: 'Mai', colis: 145, utilisateurs: 520 },
    { month: 'Juin', colis: 168, utilisateurs: 630 },
  ];

  // Distribution des statuts
  const remainder = Math.max(0, totalShipments - pendingShipments - deliveredShipments);
  const statusDataRaw = [
    { name: 'En attente', value: pendingShipments, color: '#94A3B8' },
    { name: 'En transit', value: remainder, color: '#EAB308' },
    { name: 'Livré', value: deliveredShipments, color: '#10B981' },
    { name: 'Annulé', value: 0, color: '#EF4444' },
  ];
  const statusData = statusDataRaw.filter((d) => d.value > 0);
  const totalForPie = totalShipments || 1;

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement du tableau de bord...</div>;
  }

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

  // Top 3 transporteurs par nombre de livraisons (données API)
  const topTransporters = dashboardData?.top_transporters ?? [];
  const maxDeliveries = topTransporters.length ? Math.max(...topTransporters.map((t) => t.deliveries)) : 1;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">
            Bienvenue, Admin! Voici un aperçu de votre plateforme.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            Ce-mois
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#D4A017] hover:bg-[#B38600] text-white rounded-lg text-sm font-medium transition shadow-sm">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold flex items-center gap-1 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? '↗' : '↘'} {stat.change}
                </span>
                <span className="text-gray-400">{stat.subLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Activité mensuelle</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorColis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#305669" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#305669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Legend iconType="circle" />
              <Area
                type="monotone"
                dataKey="colis"
                stroke="#305669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorColis)"
                name="Colis"
              />
              <Area
                type="monotone"
                dataKey="utilisateurs"
                stroke="#EAB308"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Utilisateurs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart - Distribution des statuts */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Distribution des statuts</h2>
          <div className="flex flex-col items-center">
            <div className="w-full" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="white"
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'colis']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '10px 14px',
                      fontSize: '13px'
                    }}
                    itemStyle={{ fontWeight: 600 }}
                    labelFormatter={(label) => label}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Légende : tous les statuts (y compris à 0) */}
            <div className="mt-4 w-full grid grid-cols-2 gap-x-4 gap-y-2">
              {statusDataRaw.map((entry, index) => {
                const percent = totalForPie ? ((entry.value / totalForPie) * 100).toFixed(1) : '0';
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="shrink-0 w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 truncate">{entry.name}</span>
                    <span className="text-sm text-gray-500 ml-auto whitespace-nowrap">
                      {entry.value} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
            {totalShipments === 0 && (
              <p className="text-sm text-gray-500 py-4">Aucun colis sur la période.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Shipments & Top Transporters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Colis récents</h2>
            <a href="/shipments" className="text-[#305669] text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-4">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{shipment.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {shipment.from} → {shipment.to}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-bold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {getStatusLabel(shipment.status)}
                  </span>
                  {shipment.stamp === 'pending' && (
                    <span className="text-[10px] text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded font-medium">
                      Timbre requis
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Transporters */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Meilleurs transporteurs</h2>
            <a href="/transporters" className="text-[#305669] text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-4">
            {topTransporters.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">Aucun transporteur avec des livraisons sur la période.</p>
            ) : (
              topTransporters.map((transporter, idx) => (
                <div
                  key={transporter.id ?? idx}
                  className="flex items-center gap-4"
                >
                  <div className="min-w-[120px]">
                    <p className="text-sm font-medium text-gray-700 truncate">{transporter.name}</p>
                    {transporter.phone && (
                      <p className="text-xs text-gray-500 truncate">{transporter.phone}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#EAB308] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (transporter.deliveries / maxDeliveries) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{transporter.deliveries} livraison{transporter.deliveries > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
