import { ArrowLeft, Edit2, Trash2, Box, Calendar, Mail, Phone, MapPin, Smartphone, User } from 'lucide-react';

export default function UserDetails({ user, onBack, onEdit, onDelete }) {
    if (!user) return null;

    // Mock activity data based on screenshot
    const activities = [
        {
            id: 1,
            type: 'receive',
            title: 'Reçu un colis',
            desc: 'Colis: YK-2025-00045',
            time: 'Il y a 1 heure',
            icon: Box,
            iconBg: 'bg-[#FDF6E7]',
            iconColor: 'text-[#E8B44D]',
        },
        {
            id: 2,
            type: 'send',
            title: 'Déposé un colis',
            desc: 'Colis: YK-2025-00044',
            time: 'Il y a 1 heure',
            icon: Box,
            iconBg: 'bg-[#FDF6E7]',
            iconColor: 'text-[#E8B44D]',
        },
        {
            id: 3,
            type: 'app',
            title: 'Connexion app',
            desc: '', // Screenshot shows no desc for this one? Or maybe just title.
            time: 'Il y a 5 jours',
            icon: Smartphone,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-500',
        }
    ];

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
                        <h1 className="text-2xl font-bold text-gray-900">{user.full_name || user.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Utilisateurs</span>
                            <span>&gt;</span>
                            <span>Utilisateur N° {user.id}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onEdit(user)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B44D] text-white rounded-xl font-medium hover:bg-[#D9A53C] transition shadow-sm"
                    >
                        <Edit2 className="h-4 w-4" />
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(user)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition"
                    >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center pb-8 border-b border-gray-100">
                            <div className="w-full h-32 bg-gray-50 rounded-t-xl mb-[-4rem]"></div>
                            <div className="relative mt-8">
                                <div className={`w-24 h-24 rounded-full ${user.avatarColor || 'bg-[#E8B44D]'} flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm`}>
                                    {user.initials || (user.name ? user.name.slice(0, 2).toUpperCase() : '??')}
                                </div>
                                {user.online && (
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                                )}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">{user.full_name || user.name}</h2>
                            <span className="mt-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                {user.role}
                            </span>
                        </div>

                        {/* Info List */}
                        <div className="py-6 space-y-5">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><Mail className="h-5 w-5 text-gray-400" /></div>
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><Phone className="h-5 w-5 text-gray-400" /></div>
                                <span className="text-sm font-medium">{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><MapPin className="h-5 w-5 text-gray-400" /></div>
                                <span className="text-sm font-medium">{user.relay_point?.address ?? user.location ?? 'Dakar, Sénégal'}</span>
                            </div>
                            {(user.relay_point?.name || user.pointName) && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 flex justify-center"><User className="h-5 w-5 text-gray-400" /></div>
                                    <span className="text-sm font-medium">{user.relay_point?.name ?? user.pointName}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><Calendar className="h-5 w-5 text-gray-400" /></div>
                                <div className="flex justify-between w-full">
                                    <span className="text-sm font-medium">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '11/10/2025'}</span>
                                    <span className="text-xs text-gray-400">Date de création</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Total colis</p>
                                <h3 className="text-3xl font-bold text-gray-900">20</h3>
                                <p className="text-xs text-gray-400 mt-2">Total</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <Box className="h-6 w-6 text-[#5B9BAD]" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Colis Envoyés</p>
                                <h3 className="text-3xl font-bold text-gray-900">12</h3>
                                <p className="text-xs text-gray-400 mt-2">8 reçus</p>
                            </div>
                            <div className="p-3 bg-[#FDF6E7] rounded-xl">
                                <Box className="h-6 w-6 text-[#E8B44D]" />
                            </div>
                        </div>
                    </div>

                    {/* Activity History */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Historique d'activité</h3>
                        <div className="space-y-8">
                            {activities.map((activity, index) => (
                                <div key={activity.id} className="relative flex gap-4">
                                    {/* Connector Line */}
                                    {index !== activities.length - 1 && (
                                        <div className="absolute left-[22px] top-12 bottom-[-20px] w-0.5 bg-gray-100"></div>
                                    )}

                                    {/* Icon */}
                                    <div className={`relative z-10 w-11 h-11 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                                        <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex justify-between items-start pt-1">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                                            {activity.desc && <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>}
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
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
