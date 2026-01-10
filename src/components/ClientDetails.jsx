import { ArrowLeft, Edit2, Trash2, Box, Smartphone } from 'lucide-react';

export default function ClientDetails({ client, onBack, onEdit, onDelete }) {
    if (!client) return null;

    // Mock activity data based on screenshot
    // In a real app, this would come from an API endpoint like /clients/{id}/activities
    const activities = [
        {
            id: 1,
            type: 'receive',
            title: 'Reçu un colis',
            desc: 'Colis: YK-2025-00045',
            time: 'Il y a 1 heure',
            icon: Box,
            iconBg: 'bg-[#F2EFE9]', // Beige/Brownish
            iconColor: 'text-[#8B5E3C]', // Brown
        },
        {
            id: 2,
            type: 'send',
            title: 'Déposé un colis',
            desc: 'Colis: YK-2025-00044',
            time: 'Il y a 1 heure',
            icon: Box,
            iconBg: 'bg-[#F2EFE9]',
            iconColor: 'text-[#8B5E3C]',
        },
        {
            id: 3,
            type: 'app_login',
            title: 'Connexion app',
            desc: '',
            time: 'Il y a 5 jours',
            icon: Smartphone,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
        },
    ];

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition border border-gray-100"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{client.full_name || client.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Clients</span>
                            <span>&gt;</span>
                            <span>Client N° {client.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onEdit(client)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#E8B44D] text-white rounded-lg font-medium hover:bg-[#D9A53C] transition shadow-sm"
                    >
                        <Edit2 className="h-4 w-4" />
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(client)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-white rounded-lg font-medium hover:bg-red-50 transition shadow-sm"
                    >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center h-full">
                        {/* Avatar Area */}
                        <div className="relative mb-4 mt-6">
                            <div className="w-24 h-24 rounded-full bg-[#E8B44D] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-sm">
                                {getInitials(client.full_name || client.name)}
                            </div>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">{client.full_name || client.name}</h2>
                        <p className="text-[#305669] font-medium mb-8">{client.role || 'Exp. & Dest.'}</p>

                        <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">{client.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm">{client.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">{client.address || client.location || 'Dakar, Sénégal'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">
                                    {client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : 'Date de création inconnue'}
                                </span>
                                <span className="text-xs text-blue-400 ml-auto">Date de création</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 font-medium text-sm mb-1">Total colis</p>
                                    <p className="text-4xl font-bold text-gray-900">20</p>
                                    <p className="text-gray-400 text-xs mt-2">Total</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <svg className="w-6 h-6 text-[#305669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 font-medium text-sm mb-1">Colis Envoyés</p>
                                    <p className="text-4xl font-bold text-gray-900">12</p>
                                    <p className="text-gray-400 text-xs mt-2">8 reçus</p>
                                </div>
                                <div className="p-3 bg-[#FFF9EB] rounded-xl">
                                    <svg className="w-6 h-6 text-[#E8B44D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity History */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Historique d'activité</h3>

                        <div className="space-y-0">
                            {activities.map((activity, index) => (
                                <div key={activity.id} className="flex gap-4 group">
                                    {/* Icon */}
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.iconBg} ${activity.iconColor} z-10 relative`}>
                                            <activity.icon className="h-5 w-5" />
                                        </div>
                                        {/* Vertical line connector - don't show for last item */}
                                        {index !== activities.length - 1 && (
                                            <div className="absolute top-10 left-5 -translate-x-1/2 w-0.5 h-full bg-gray-100 -z-0" style={{ height: 'calc(100% + 24px)' }}></div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-8 border-b border-gray-50 last:border-0 group-last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900">{activity.title}</p>
                                                {activity.desc && <p className="text-sm text-gray-500 mt-0.5">{activity.desc}</p>}
                                            </div>
                                            <span className="text-sm text-gray-400 whitespace-nowrap">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
