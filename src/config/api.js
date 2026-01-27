/**
 * Configuration API pour Yes Karangue Admin
 * Centralise les endpoints et la configuration de base
 */

// URL de base de l'API - Utilise le proxy en développement
export const API_BASE_URL = import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_BASE_URL || 'https://xamleprodbackend.yeskarangue.com');

// Endpoints d'authentification
export const AUTH_ENDPOINTS = {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH_TOKEN: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    ADMIN_DASHBOARD: '/api/v1/admin/dashboard',
    ADMIN_TRANSPORTERS: '/api/v1/admin/transporters',
};

// Autres endpoints
export const API_ENDPOINTS = {
    // Colis
    SHIPMENTS: '/api/v1/shipments',
    // Expéditeurs
    SHIPPERS: '/api/v1/shippers',
    // Transporteurs
    TRANSPORTERS: '/api/v1/transporters',
    // Utilisateurs
    USERS: '/api/v1/users',
    // Points de retrait
    POINTS: '/api/v1/points',
    // Clients
    CLIENTS: '/api/v1/clients',
    // Statistiques
    STATS: '/api/v1/stats',
};

/**
 * Configuration des headers par défaut
 */
export const getDefaultHeaders = () => {
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Fonction utilitaire pour construire une URL complète
 */
export const buildUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};
