/**
 * Service d'authentification pour Yes Karangue Admin
 * Gère la connexion, déconnexion et la gestion du token
 */

import { API_BASE_URL, AUTH_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';

/**
 * Connexion d'un utilisateur (Agent ou Admin)
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe
 * @returns {Promise<Object>} Les données de l'utilisateur connecté
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(buildUrl(AUTH_ENDPOINTS.LOGIN), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        // Vérifier si la réponse est OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Gérer les différents codes d'erreur
            if (response.status === 401) {
                throw new Error('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
            } else if (response.status === 422) {
                throw new Error('Erreur de validation. Veuillez vérifier les informations saisies.');
            } else if (response.status === 404) {
                throw new Error('Service d\'authentification non disponible.');
            } else {
                throw new Error(errorData.message || 'Erreur de connexion. Veuillez réessayer.');
            }
        }

        const data = await response.json();

        // Vérifier que la réponse contient les données attendues
        if (!data.user || !data.role) {
            throw new Error('Réponse invalide du serveur.');
        }

        // Vérifier que l'utilisateur a un rôle valide (agent ou admin)
        const validRoles = ['agent', 'admin'];
        if (!validRoles.includes(data.role)) {
            throw new Error('Rôle utilisateur non autorisé. Seuls les agents et administrateurs peuvent se connecter.');
        }

        return data;
    } catch (error) {
        // Re-throw les erreurs personnalisées
        if (error.message) {
            throw error;
        }

        // Gérer les erreurs réseau
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
    }
};

/**
 * Rafraîchit le token d'accès en utilisant le cookie refresh_token
 * @returns {Promise<string>} Le nouveau token d'accès
 */
export const refreshToken = async () => {
    try {
        const response = await fetch(buildUrl(AUTH_ENDPOINTS.REFRESH_TOKEN), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important pour envoyer le cookie refresh_token
        });

        if (!response.ok) {
            throw new Error('Échec du rafraîchissement du token');
        }

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem('authToken', data.access_token);
            return data.access_token;
        }

        throw new Error('Token non reçu');
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        // En cas d'échec (token expiré ou invalide), on déconnecte l'utilisateur
        logout();
        throw error;
    }
};

/**
 * Sauvegarde les données de session dans le localStorage
 * @param {Object} authData - Les données d'authentification
 */
export const saveAuthData = (authData) => {
    try {
        // Sauvegarder le token
        if (authData.access_token) {
            localStorage.setItem('authToken', authData.access_token);
        }

        // Sauvegarder le rôle
        if (authData.role) {
            localStorage.setItem('userRole', authData.role);
        }

        // Sauvegarder les données utilisateur
        if (authData.user) {
            localStorage.setItem('userData', JSON.stringify(authData.user));

            // Sauvegarder l'email si disponible
            if (authData.user.email || authData.user.login) {
                localStorage.setItem('userEmail', authData.user.email || authData.user.login);
            }
        }

        // Sauvegarder le nom de l'entreprise si disponible
        if (authData.entrepriseName) {
            localStorage.setItem('entrepriseName', authData.entrepriseName);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
    }
};

/**
 * Récupère les données de l'utilisateur connecté depuis le localStorage
 * @returns {Object|null} Les données de l'utilisateur ou null
 */
export const getAuthData = () => {
    try {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole');
        const userDataStr = localStorage.getItem('userData');
        const entrepriseName = localStorage.getItem('entrepriseName');

        if (!token || !role) {
            return null;
        }

        return {
            token,
            role,
            user: userDataStr ? JSON.parse(userDataStr) : null,
            entrepriseName,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'authentification:', error);
        return null;
    }
};

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} True si connecté, false sinon
 */
export const isAuthenticated = () => {
    const authData = getAuthData();
    return authData !== null && authData.token !== null;
};

/**
 * Récupère le rôle de l'utilisateur connecté
 * @returns {string|null} Le rôle ('agent' ou 'admin') ou null
 */
export const getUserRole = () => {
    const authData = getAuthData();
    return authData ? authData.role : null;
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {string} role - Le rôle à vérifier
 * @returns {boolean} True si l'utilisateur a ce rôle
 */
export const hasRole = (role) => {
    const userRole = getUserRole();
    return userRole === role;
};

/**
 * Déconnexion de l'utilisateur
 * Appelle l'API de déconnexion et supprime toutes les données de session
 */
export const logout = async () => {
    try {
        // Tentative de déconnexion côté serveur
        const token = localStorage.getItem('authToken');
        if (token) {
            await fetch(buildUrl(AUTH_ENDPOINTS.LOGOUT), {
                method: 'POST',
                headers: getDefaultHeaders(),
            });
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion API:', error);
    } finally {
        // Supprimer toutes les données de session localement dans tous les cas
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('entrepriseName');

        // Rediriger vers la page de connexion
        window.location.href = '/';
    }
};

/**
 * Récupère le token d'authentification
 * @returns {string|null} Le token ou null
 */
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};
