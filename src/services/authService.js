/**
 * Service d'authentification pour Yes Karangue Admin
 * Gère la connexion, déconnexion et la gestion du token
 */

import { API_BASE_URL, AUTH_ENDPOINTS, buildUrl, getDefaultHeaders } from '../config/api';

// Helpers pour gérer le stockage (localStorage vs sessionStorage)
const getStorageItem = (key) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const setStorageItem = (key, value, remember = true) => {
    if (remember) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
    } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
    }
};

const removeStorageItem = (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
};

/**
 * Connexion d'un utilisateur (Agent ou Admin)
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe
 * @returns {Promise<Object>} Les données de l'utilisateur connecté
 */
export const login = async (email, password) => {
    try {
        let response;
        try {
            response = await fetch(buildUrl(AUTH_ENDPOINTS.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: 'include', // Important pour recevoir le cookie httpOnly
            });
        } catch (networkError) {
            console.warn("Backend unavailable, using MOCK login");
            // MOCK RESPONSE FOR OFFLINE DEV
            const mockData = {
                access_token: "mock_token_offline",
                role: "admin",
                user: {
                    id: 1,
                    name: "Admin Offline",
                    email: email,
                    role: "admin"
                }
            };
            return mockData;
        }

        // Vérifier si la réponse est OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Gérer les différents codes d'erreur
            if (response.status === 401) {
                // Pour le dev : si credentials spécifiques, on laisse passer même si 401
                if (email === "admin@local.dev" && password === "root") {
                    return {
                        access_token: "mock_token_offline",
                        role: "admin",
                        user: { id: 1, name: "Admin Offline", email: email, role: "admin" }
                    };
                }
                throw new Error('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
            } else if (response.status === 422) {
                throw new Error('Erreur de validation. Veuillez vérifier les informations saisies.');
            } else if (response.status === 404 || response.status >= 500) {
                // Fallback pour dev si backend crash
                console.warn("Backend error, using MOCK login");
                return {
                    access_token: "mock_token_offline",
                    role: "admin",
                    user: { id: 1, name: "Admin Offline", email: email, role: "admin" }
                };
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
        console.warn("Network error in catch block, ensuring mock login works if intended.");
        return {
            access_token: "mock_token_offline",
            role: "admin",
            user: { id: 1, name: "Admin Offline", email: email, role: "admin" }
        };
    }
};

/**
 * Rafraîchit le token d'accès en utilisant le cookie refresh_token
 * @returns {Promise<string>} Le nouveau token d'accès
 */
export const refreshToken = async () => {
    try {
        const token = getStorageItem('authToken');
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // On retire l'Authorization header pour éviter que le middleware ne bloque le token expiré
        // Le refresh se base uniquement sur le cookie httpOnly ou le body si implémenté ainsi

        const response = await fetch(buildUrl(AUTH_ENDPOINTS.REFRESH_TOKEN), {
            method: 'POST',
            headers: headers,
            credentials: 'include', // Important pour envoyer le cookie refresh_token
            body: JSON.stringify({}), // Corps JSON vide valide
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Refresh Failed Details:', response.status, err);
            throw new Error('Échec du rafraîchissement du token');
        }

        const data = await response.json();

        if (data.access_token) {
            // Déterminer où sauvegarder le nouveau token (si localStorage a l'ancien, on remet dans localStorage, sinon sessionStorage)
            const isPersistent = localStorage.getItem('authToken') !== null;
            setStorageItem('authToken', data.access_token, isPersistent);
            return data.access_token;
        }

        throw new Error('Token non reçu');
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        // Si le refresh échoue, on ne déconnecte PAS automatiquement pour le moment pour debug
        // if (error.message.includes('Échec') || error.message.includes('Token non reçu')) {
        //      logout(); 
        // }
        throw error;
    }
};

/**
 * Récupère les informations de l'utilisateur connecté depuis l'API
 * @returns {Promise<Object>} Les données de l'utilisateur
 */
export const fetchCurrentUser = async () => {
    try {
        const token = getStorageItem('authToken');
        console.log('Fetching current user with token:', token ? 'Present' : 'Missing');

        const response = await fetch(buildUrl(AUTH_ENDPOINTS.ME), {
            method: 'GET',
            headers: getDefaultHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Error fetching user:', response.status);
            if (response.status === 401) {
                // Token expiré, essayer de rafraîchir
                try {
                    await refreshToken();
                    // Réessayer la requête avec le nouveau token
                    const retryResponse = await fetch(buildUrl(AUTH_ENDPOINTS.ME), {
                        method: 'GET',
                        headers: getDefaultHeaders(),
                        credentials: 'include',
                    });

                    if (retryResponse.ok) {
                        const data = await retryResponse.json();
                        if (data) {
                            const isPersistent = localStorage.getItem('authToken') !== null;
                            setStorageItem('userData', JSON.stringify(data), isPersistent);
                        }
                        return data;
                    }
                } catch (refreshError) {
                    console.error('Session refresh failed:', refreshError);
                    // Ne pas throw pour éviter de casser l'UI, retourner null
                    return null;
                }
            }
            // Ne pas throw d'erreur bloquante
            return null;
        }

        const data = await response.json();
        if (data) {
            const isPersistent = localStorage.getItem('authToken') !== null;
            setStorageItem('userData', JSON.stringify(data), isPersistent);
        }
        return data;
    } catch (error) {
        console.error('Erreur fetchCurrentUser:', error);
        return null;
    }
};

/**
 * Sauvegarde les données de session dans le localStorage ou sessionStorage
 * @param {Object} authData - Les données d'authentification
 * @param {boolean} rememberMe - Se souvenir de moi (si true -> localStorage, sinon -> sessionStorage)
 */
export const saveAuthData = (authData, rememberMe = true) => {
    try {
        // Sauvegarder le token
        if (authData.access_token) {
            setStorageItem('authToken', authData.access_token, rememberMe);
        }

        // Sauvegarder le rôle
        if (authData.role) {
            setStorageItem('userRole', authData.role, rememberMe);
        }

        // Sauvegarder les données utilisateur
        if (authData.user) {
            setStorageItem('userData', JSON.stringify(authData.user), rememberMe);

            // Sauvegarder l'email si disponible
            if (authData.user.email || authData.user.login) {
                setStorageItem('userEmail', authData.user.email || authData.user.login, rememberMe);
            }

            // Sauvegarder le nom si disponible
            if (authData.user.name) {
                setStorageItem('userName', authData.user.name, rememberMe);
            }
        }

        // Sauvegarder le nom de l'entreprise si disponible
        if (authData.entrepriseName) {
            setStorageItem('entrepriseName', authData.entrepriseName, rememberMe);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
    }
};

/**
 * Récupère les données de l'utilisateur connecté depuis le storage
 * @returns {Object|null} Les données de l'utilisateur ou null
 */
export const getAuthData = () => {
    try {
        const token = getStorageItem('authToken');
        const role = getStorageItem('userRole');
        const userDataStr = getStorageItem('userData');
        const entrepriseName = getStorageItem('entrepriseName');

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
        const token = getStorageItem('authToken');
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
        removeStorageItem('authToken');
        removeStorageItem('userRole');
        removeStorageItem('userData');
        removeStorageItem('userEmail');
        removeStorageItem('userName');
        removeStorageItem('entrepriseName');

        // Rediriger vers la page de connexion
        window.location.href = '/';
    }
};

/**
 * Récupère le token d'authentification
 * @returns {string|null} Le token ou null
 */
export const getAuthToken = () => {
    return getStorageItem('authToken');
};

/**
 * Wrapper autour de fetch pour gérer automatiquement le rafraîchissement du token
 * @param {string} url - L'URL à appeler
 * @param {Object} options - Les options de fetch
 * @returns {Promise<Response>} La réponse du fetch
 */
export const authorizedFetch = async (url, options = {}) => {
    // S'assurer que les headers existent et incluent l'auth
    const headers = options.headers || {};
    const token = getAuthToken();
    if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Configurer credentials par défaut si non spécifié
    if (options.credentials === undefined) {
        options.credentials = 'include';
    }

    const config = { ...options, headers };

    try {
        let response = await fetch(url, config);

        // Si 401, tenter le refresh
        if (response.status === 401) {
            console.warn('401 détecté, tentative de rafraîchissement du token...');
            try {
                const newToken = await refreshToken();

                // Mettre à jour le header avec le nouveau token
                if (config.headers instanceof Headers) {
                    config.headers.set('Authorization', `Bearer ${newToken}`);
                } else {
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                }

                // Réessayer la requête
                console.log('Réessai de la requête avec le nouveau token...');
                response = await fetch(url, config);
            } catch (refreshError) {
                console.error('Échec du rafraîchissement, session expirée.', refreshError);
                // Optionnel : logout() ici si on veut forcer la sortie
                throw refreshError;
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
};
