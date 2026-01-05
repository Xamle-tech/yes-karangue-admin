/**
 * Service pour gérer les utilisateurs
 */
import { API_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère la liste des utilisateurs avec filtres et pagination
 * @param {Object} params - Filtres optionnels
 * @param {string} params.q - Recherche par nom, email ou téléphone
 * @param {string} params.role - Filtrer par rôle (admin, agent, client, carrier, MANAGER)
 * @param {number} params.relay_point_id - Filtrer par point relais
 * @param {string} params.status - Filtrer par statut (active, inactive, pending)
 * @param {number} params.limit - Nombre de résultats (défaut: 20)
 * @param {number} params.offset - Offset pour pagination (défaut: 0)
 * @returns {Promise<Object>} Liste des utilisateurs et métadonnées
 */
export const fetchUsers = async (params = {}) => {
    try {
        // Construire les query params
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = buildUrl('/api/v1/admin/users' + (queryString ? `?${queryString}` : ''));

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
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};

/**
 * Récupère les détails d'un utilisateur par son ID
 * @param {number} userId - L'ID de l'utilisateur
 * @returns {Promise<Object>} Les détails de l'utilisateur
 */
export const fetchUserById = async (userId) => {
    try {
        const url = buildUrl(`/api/v1/admin/users/${userId}`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Utilisateur non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw error;
    }
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Les données de l'utilisateur
 * @returns {Promise<Object>} L'utilisateur créé
 */
export const createUser = async (userData) => {
    try {
        const response = await authorizedFetch(buildUrl('/api/v1/admin/users'), {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
};

/**
 * Met à jour un utilisateur
 * @param {number} userId - L'ID de l'utilisateur
 * @param {Object} userData - Les données à mettre à jour
 * @returns {Promise<Object>} L'utilisateur mis à jour
 */
export const updateUser = async (userId, userData) => {
    try {
        const response = await authorizedFetch(buildUrl(`/api/v1/admin/users/${userId}`), {
            method: 'PATCH',
            headers: getDefaultHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Utilisateur non trouvé');
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
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error;
    }
};

/**
 * Supprime un utilisateur
 * @param {number} userId - L'ID de l'utilisateur à supprimer
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
    try {
        const url = buildUrl(`/api/v1/admin/users/${userId}`);

        const response = await authorizedFetch(url, {
            method: 'DELETE',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Utilisateur non trouvé');
            }
            if (response.status === 409) {
                throw new Error('Impossible de supprimer cet utilisateur car il est en cours d\'utilisation');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw error;
    }
};

/**
 * Renvoie l'email d'invitation à un utilisateur
 * @param {number} userId - L'ID de l'utilisateur
 * @returns {Promise<void>}
 */
export const resendUserInvitation = async (userId) => {
    try {
        const url = buildUrl(`/api/v1/admin/users/${userId}/invite/resend`);

        const response = await authorizedFetch(url, {
            method: 'POST',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Utilisateur non trouvé');
            }
            if (response.status === 409) {
                throw new Error('Invitation déjà acceptée ou utilisateur déjà actif');
            }
            if (response.status === 429) {
                throw new Error('Trop de tentatives. Veuillez réessayer plus tard');
            }
            if (response.status === 503) {
                throw new Error('Service email indisponible. Veuillez réessayer plus tard');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return;
    } catch (error) {
        console.error('Erreur lors du renvoi de l\'invitation:', error);
        throw error;
    }
};

/**
 * Recherche d'utilisateurs (autocomplete)
 * @param {Object} params - Paramètres de recherche
 * @param {string} params.q - Terme de recherche
 * @param {string} params.role - Filtrer par rôle (ADMIN, AGENT, MANAGER)
 * @param {number} params.limit - Nombre de résultats (défaut: 20)
 * @returns {Promise<Array>} Liste d'utilisateurs correspondants
 */
export const lookupUsers = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = buildUrl('/api/v1/admin/users/lookup' + (queryString ? `?${queryString}` : ''));

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 422) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erreur de validation');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        throw error;
    }
};
