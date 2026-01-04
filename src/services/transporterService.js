/**
 * Service pour gérer les transporteurs
 */
import { AUTH_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

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

        const response = await authorizedFetch(url.toString(), {
            method: 'GET',
            headers: getDefaultHeaders(),
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

/**
 * Crée un nouveau transporteur
 * @param {FormData} formData - Les données du transporteur (multipart/form-data)
 * @returns {Promise<Object>} Le transporteur créé
 */
export const createTransporter = async (formData) => {
    try {
        const response = await authorizedFetch(buildUrl(AUTH_ENDPOINTS.ADMIN_TRANSPORTERS), {
            method: 'POST',
            // Ne PAS définir Content-Type pour multipart/form-data
            headers: {
                'Accept': 'application/json',
                // Authorization sera ajouté par authorizedFetch
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création du transporteur:', error);
        throw error;
    }
};

/**
 * Récupère les détails d'un transporteur par son ID
 * @param {number} transporterId - L'ID du transporteur
 * @returns {Promise<Object>} Les détails du transporteur
 */
export const fetchTransporterById = async (transporterId) => {
    try {
        const url = buildUrl(`${AUTH_ENDPOINTS.ADMIN_TRANSPORTERS}/${transporterId}`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Transporteur non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du transporteur:', error);
        throw error;
    }
};

/**
 * Supprime un transporteur (soft delete)
 * @param {number} transporterId - L'ID du transporteur à supprimer
 * @returns {Promise<void>}
 */
export const deleteTransporter = async (transporterId) => {
    try {
        const url = buildUrl(`${AUTH_ENDPOINTS.ADMIN_TRANSPORTERS}/${transporterId}`);

        const response = await authorizedFetch(url, {
            method: 'DELETE',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Transporteur non trouvé');
            }
            if (response.status === 409) {
                throw new Error('Impossible de supprimer ce transporteur car il est en cours d\'utilisation');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // 204 No Content - succès
        return;
    } catch (error) {
        console.error('Erreur lors de la suppression du transporteur:', error);
        throw error;
    }
};
