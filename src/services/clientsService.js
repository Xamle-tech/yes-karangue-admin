/**
 * Service pour gérer les clients (vue admin)
 */
import { buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère la liste de tous les clients
 * @param {Object} params - Paramètres optionnels de filtrage/pagination
 * @returns {Promise<Array>} Liste des clients
 */
export const fetchClients = async (params = {}) => {
    try {
        // Construire les query params
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = buildUrl('/api/v1/admin/clients' + (queryString ? `?${queryString}` : ''));

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
        console.error('Erreur lors de la récupération des clients:', error);
        throw error;
    }
};

/**
 * Récupère les détails d'un client par son ID
 * @param {number|string} clientId - L'ID du client
 * @returns {Promise<Object>} Les détails du client
 */
export const fetchClientById = async (clientId) => {
    try {
        const url = buildUrl(`/api/v1/admin/clients/${clientId}`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Client non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du client:', error);
        throw error;
    }
};
