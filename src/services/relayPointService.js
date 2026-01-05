/**
 * Service pour gérer les points de retrait
 */
import { API_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère la liste des points de retrait avec filtres
 * @param {Object} params - Filtres optionnels
 * @param {string} params.q - Recherche par nom ou adresse
 * @param {string} params.type - Type de point (DEPOT, RETRAIT, DEPOT_RETRAIT)
 * @param {boolean} params.status - Filtrer par statut actif/inactif
 * @param {number} params.limit - Nombre de résultats (défaut: 20)
 * @param {number} params.offset - Offset pour pagination (défaut: 0)
 * @returns {Promise<Object>} Liste des points de retrait et métadonnées
 */
export const fetchRelayPoints = async (params = {}) => {
    try {
        // Construire les query params
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = buildUrl('/api/v1/admin/relay-points' + (queryString ? `?${queryString}` : ''));

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des points de retrait:', error);
        throw error;
    }
};

/**
 * Récupère la liste des types de points relais disponibles
 * @returns {Promise<Array>} Liste des types avec value et label
 */
export const fetchRelayPointTypes = async () => {
    try {
        const url = buildUrl('/api/v1/admin/relay-point-types');

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des types de points relais:', error);
        throw error;
    }
};


/**
 * Récupère les détails d'un point de retrait par son ID
 * @param {number} relayPointId - L'ID du point de retrait
 * @returns {Promise<Object>} Les détails du point de retrait
 */
export const fetchRelayPointById = async (relayPointId) => {
    try {
        const url = buildUrl(`/api/v1/admin/relay-points/${relayPointId}`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Point de retrait non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du point de retrait:', error);
        throw error;
    }
};

/**
 * Crée un nouveau point de retrait
 * @param {Object} relayPointData - Les données du point de retrait
 * @returns {Promise<Object>} Le point de retrait créé
 */
export const createRelayPoint = async (relayPointData) => {
    try {
        const response = await authorizedFetch(buildUrl('/api/v1/admin/relay-points'), {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(relayPointData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création du point de retrait:', error);
        throw error;
    }
};

/**
 * Met à jour un point de retrait
 * @param {number} relayPointId - L'ID du point de retrait
 * @param {Object} relayPointData - Les données à mettre à jour
 * @returns {Promise<Object>} Le point de retrait mis à jour
 */
export const updateRelayPoint = async (relayPointId, relayPointData) => {
    try {
        const response = await authorizedFetch(buildUrl(`/api/v1/admin/relay-points/${relayPointId}`), {
            method: 'PATCH',
            headers: getDefaultHeaders(),
            body: JSON.stringify(relayPointData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Point de retrait non trouvé');
            }
            if (response.status === 409) {
                throw new Error('Ressource en cours d\'utilisation');
            }
            if (response.status === 422) {
                const errorData = await response.json().catch(() => ({}));
                const validationErrors = errorData.details || {};
                const firstError = Object.values(validationErrors)[0];
                throw new Error(firstError || errorData.message || 'Erreur de validation');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du point de retrait:', error);
        throw error;
    }
};

/**
 * Supprime un point de retrait
 * @param {number} relayPointId - L'ID du point de retrait à supprimer
 * @returns {Promise<void>}
 */
export const deleteRelayPoint = async (relayPointId) => {
    try {
        const url = buildUrl(`/api/v1/admin/relay-points/${relayPointId}`);

        const response = await authorizedFetch(url, {
            method: 'DELETE',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Point de retrait non trouvé');
            }
            if (response.status === 409) {
                throw new Error('Impossible de supprimer ce point de retrait car il est en cours d\'utilisation');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return;
    } catch (error) {
        console.error('Erreur lors de la suppression du point de retrait:', error);
        throw error;
    }
};
