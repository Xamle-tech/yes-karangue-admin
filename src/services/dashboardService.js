/**
 * Service pour gérer les données du dashboard
 */
import { AUTH_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère les statistiques du dashboard admin
 * @param {string} period - La période pour les stats (default: 'month')
 * @returns {Promise<Object>} Les statistiques
 */
export const fetchDashboardStats = async (period = 'month') => {
    try {
        const url = new URL(buildUrl(AUTH_ENDPOINTS.ADMIN_DASHBOARD));
        url.searchParams.append('period', period);

        const response = await authorizedFetch(url.toString(), {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des stats dashboard:', error);
        throw error;
    }
};
