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
        const baseUrl = buildUrl(AUTH_ENDPOINTS.ADMIN_TRANSPORTERS);
        console.log('🔧 Base URL:', baseUrl);

        // Construire l'URL avec les paramètres (utiliser window.location.origin pour les URLs relatives)
        const url = new URL(baseUrl, window.location.origin);

        // Ajouter les paramètres de requête
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });

        console.log('🌐 URL appelée:', url.toString());
        console.log('🔑 Token présent:', !!localStorage.getItem('authToken'));

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
 * Met à jour un transporteur existant
 * @param {number} id - ID du transporteur
 * @param {FormData} formData - Les données à mettre à jour (multipart/form-data)
 * @returns {Promise<Object>} Le transporteur mis à jour
 */
export const updateTransporter = async (id, formData) => {
    try {
        // En méthode PATCH, Laravel/Symfony peut nécessiter _method: PATCH si multipart
        // Mais ici on utilise PATCH direct. Si ça échoue avec multipart, on ajoutera _method.
        formData.append('_method', 'PATCH');

        const response = await authorizedFetch(buildUrl(`${AUTH_ENDPOINTS.ADMIN_TRANSPORTERS}/${id}`), {
            method: 'POST', // On utilise POST avec _method=PATCH pour le support multipart/form-data fiable
            headers: {
                'Accept': 'application/json',
                // Authorization auto via authorizedFetch
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du transporteur:', error);
        throw error;
    }
};

/**
 * Récupère les statistiques des transporteurs (par point relais, par type de véhicule)
 * @returns {Promise<Object>} { total_transporters, by_station, by_vehicle_type, ... }
 */
export const fetchTransportersStatistics = async () => {
    try {
        const url = buildUrl(`${AUTH_ENDPOINTS.ADMIN_TRANSPORTERS}/statistics`);
        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques transporteurs:', error);
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
