/**
 * Service pour gérer les rôles
 */
import { buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère la liste de tous les rôles disponibles
 * @returns {Promise<Array>} Liste des rôles
 */
export const fetchRoles = async () => {
    try {
        const url = buildUrl('/api/v1/admin/roles');

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
        console.error('Erreur lors de la récupération des rôles:', error);
        throw error;
    }
};
