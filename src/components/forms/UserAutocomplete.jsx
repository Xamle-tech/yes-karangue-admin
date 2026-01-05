import { useState, useEffect } from 'react';
import { lookupUsers } from '../../services/userService';

/**
 * Composant d'autocomplétion pour la recherche d'utilisateurs
 * @param {Function} onSelect - Callback appelé quand un utilisateur est sélectionné
 * @param {string} roleFilter - Filtrer par rôle (ADMIN, AGENT, MANAGER)
 * @param {string} placeholder - Texte du placeholder
 * @param {string} className - Classes CSS personnalisées
 */
export default function UserAutocomplete({
    onSelect,
    roleFilter = '',
    placeholder = "Rechercher un utilisateur...",
    className = ""
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                try {
                    setLoading(true);
                    const users = await lookupUsers({
                        q: searchTerm,
                        role: roleFilter,
                        limit: 10
                    });
                    setResults(users);
                    setShowResults(true);
                } catch (error) {
                    console.error('Erreur recherche:', error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, roleFilter]);

    const handleSelect = (user) => {
        onSelect(user);
        setSearchTerm('');
        setResults([]);
        setShowResults(false);
    };

    // Fermer les résultats quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = () => setShowResults(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {loading && (
                    <div className="absolute right-3 top-3">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                )}

                {!loading && searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setResults([]);
                            setShowResults(false);
                        }}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {results.map(user => (
                        <button
                            key={user.id}
                            onClick={() => handleSelect(user)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <div>
                                <p className="font-medium text-gray-900">{user.full_name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                {user.role}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {showResults && searchTerm.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <p className="text-gray-500 text-sm text-center">Aucun utilisateur trouvé</p>
                </div>
            )}
        </div>
    );
}
