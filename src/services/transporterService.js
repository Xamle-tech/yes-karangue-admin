/**
 * Service pour gérer les transporteurs
 */
import { AUTH_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';

/**
 * Récupère la liste des transporteurs
 * @param {Object} params - Filtres (q, vehicle_type, etc.)
 * @returns {Promise<Object>} Liste des transporteurs et métadonnées
 */
export const fetchTransporters = async (params = {}) => {
    try {
        const url = new URL(buildUrl(AUTH_ENDPOINTS.ADMIN_TRANSPORTERS));

        // Ajouter les paramètres de requête
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: getDefaultHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des transporteurs:', error);
        throw error;
    }
};
