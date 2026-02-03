/**
 * Service colis pour l'admin (données réelles)
 */
import { buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère la liste des colis avec pagination et stats
 * @param {Object} params - q, status, per_page, page
 * @returns {Promise<{ data: Array, total: number, stats: Object }>}
 */
export const fetchAdminShipments = async (params = {}) => {
  const queryParams = new URLSearchParams();
  ['q', 'status', 'per_page', 'page'].forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  const url = buildUrl('/api/v1/admin/shipments' + (queryString ? `?${queryString}` : ''));

  const response = await authorizedFetch(url, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json();
};
