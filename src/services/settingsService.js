/**
 * Service pour les paramètres (admin)
 */
import { AUTH_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère les paramètres depuis l'API
 * @returns {Promise<Object>} { commission, maxWeight, stampPrice, emailNotifications, smsNotifications }
 */
export const fetchSettings = async () => {
    const response = await authorizedFetch(buildUrl(AUTH_ENDPOINTS.ADMIN_SETTINGS), {
        method: 'GET',
        headers: getDefaultHeaders(),
    });
    if (!response.ok) throw new Error('Impossible de charger les paramètres');
    return response.json();
};

/**
 * Enregistre les paramètres en base
 * @param {Object} data - { commission?, maxWeight?, stampPrice?, emailNotifications?, smsNotifications? }
 */
export const updateSettings = async (data) => {
    const response = await authorizedFetch(buildUrl(AUTH_ENDPOINTS.ADMIN_SETTINGS), {
        method: 'PUT',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Erreur lors de l\'enregistrement');
    }
    return response.json();
};
