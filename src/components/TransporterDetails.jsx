import { ArrowLeft, Edit2, Trash2, Box, Calendar, Mail, Phone, MapPin, Truck, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TransporterDetails({ transporter, onBack, onEdit, onDelete }) {
    if (!transporter) return null;

    const profile = transporter.transporter_profile || {};

    // Helper for vehicle icon
    const getVehicleIcon = (type) => {
        // simple mapping, can be expanded
        return Truck;
    };
    const VehicleIcon = getVehicleIcon(profile.vehicle_type);

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
                        <h1 className="text-2xl font-bold text-gray-900">{transporter.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Transporteurs</span>
                            <span>&gt;</span>
                            <span>Transporteur N° {transporter.id}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onEdit(transporter)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B44D] text-white rounded-xl font-medium hover:bg-[#D9A53C] transition shadow-sm"
                    >
                        <Edit2 className="h-4 w-4" />
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(transporter)}
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
                                <div className={`w-24 h-24 rounded-full bg-[#305669] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm`}>
                                    {transporter.name ? transporter.name.substring(0, 2).toUpperCase() : 'TR'}
                                </div>
                                <div className={`absolute bottom-1 right-1 w-5 h-5 border-4 border-white rounded-full ${transporter.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">{transporter.name}</h2>
                            <span className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${transporter.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {transporter.status === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                        </div>

                        {/* Info List */}
                        <div className="py-6 space-y-5">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><Mail className="h-5 w-5 text-gray-400" /></div>
                                <span className="text-sm font-medium">{transporter.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><Phone className="h-5 w-5 text-gray-400" /></div>
                                <span className="text-sm font-medium">{transporter.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 flex justify-center"><Calendar className="h-5 w-5 text-gray-400" /></div>
                                <div className="flex justify-between w-full">
                                    <span className="text-sm font-medium">{transporter.created_at ? new Date(transporter.created_at).toLocaleDateString() : '-'}</span>
                                    <span className="text-xs text-gray-400">Inscrit le</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Vehicle & Docs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Livraisons effectuées</p>
                                <h3 className="text-3xl font-bold text-gray-900">{transporter.deliveries_count || 0}</h3>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <Box className="h-6 w-6 text-[#305669]" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Revenus générés</p>
                                <h3 className="text-3xl font-bold text-gray-900">{transporter.total_earnings || 0} F</h3>
                            </div>
                            <div className="p-3 bg-[#FDF6E7] rounded-xl">
                                <div className="text-lg font-bold text-[#E8B44D]">Fcfa</div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <VehicleIcon className="h-5 w-5 text-gray-500" />
                            Informations Véhicule
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Type de véhicule</p>
                                <p className="font-medium text-gray-900 capitalize">{profile.vehicle_type || 'Non défini'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Immatriculation</p>
                                <p className="font-medium text-gray-900">{profile.vehicle_plate || 'Non défini'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Assurance</p>
                                <p className="font-medium text-gray-900">{profile.insurer_name || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Expiration Assurance</p>
                                <p className={`font-medium ${!profile.insurance_expires_at ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {profile.insurance_expires_at ? new Date(profile.insurance_expires_at).toLocaleDateString() : 'Non renseigné'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Point de retrait (Station)</p>
                                <p className="font-medium text-gray-900">{profile.station ? profile.station.name : (profile.station_id ? `#${profile.station_id}` : 'Non assigné')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            Documents
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'CNI Recto', url: profile.id_card_front_url || profile.id_card_front },
                                { label: 'CNI Verso', url: profile.id_card_back_url || profile.id_card_back },
                                { label: 'Carte Grise', url: profile.vehicle_registration_card_url || profile.vehicle_registration_card },
                            ].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.url ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.label}</p>
                                            <p className="text-xs text-gray-500">{doc.url ? 'Document disponible' : 'Manquant'}</p>
                                        </div>
                                    </div>
                                    {doc.url ? (
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-[#305669] hover:underline"
                                        >
                                            Voir
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Non disponible</span>
                                    )}
                                </div>
                            ))}

                            {/* Photos Vehicle - simplified list */}
                            {profile.vehicle_photos && (Array.isArray(profile.vehicle_photos) ? profile.vehicle_photos : []).length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Photos du véhicule</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {(Array.isArray(profile.vehicle_photos) ? profile.vehicle_photos : []).map((photo, i) => (
                                            <a key={i} href={photo} target="_blank" rel="noreferrer" className="block w-20 h-20 shrink-0 border rounded-lg overflow-hidden hover:opacity-80">
                                                <img src={photo} alt={`Véhicule ${i + 1}`} className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
