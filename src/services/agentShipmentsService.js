/**
 * Service pour gérer les colis (shipments) - Vue Agent
 */
import { buildUrl, getDefaultHeaders } from '../config/api';
import { authorizedFetch } from './authService';

/**
 * Récupère la liste des colis avec filtres optionnels
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Filtrer par statut (DEPOT, etc.)
 * @param {string} params.tracking_number - Rechercher par numéro de suivi (ex: YK-2025-00001)
 * @returns {Promise<Array>} Liste des colis
 */
export const fetchAgentShipments = async (params = {}) => {
    try {
        // Construire les query params
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = buildUrl('/api/v1/agent/shipments' + (queryString ? `?${queryString}` : ''));

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
        console.error('Erreur lors de la récupération des colis:', error);
        throw error;
    }
};

/**
 * Récupère les détails d'un colis par son ID
 * @param {number|string} shipmentId - L'ID du colis
 * @returns {Promise<Object>} Les détails du colis
 */
export const fetchAgentShipmentById = async (shipmentId) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${shipmentId}`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du colis:', error);
        throw error;
    }
};

/**
 * Crée un nouveau colis avec informations expéditeur et destinataire
 * @param {Object} shipmentData - Les données du colis
 * @param {string} shipmentData.sender_full_name - Nom complet de l'expéditeur (requis)
 * @param {string} shipmentData.sender_phone - Téléphone de l'expéditeur (requis)
 * @param {string} shipmentData.sender_address - Adresse de l'expéditeur (requis)
 * @param {string} shipmentData.sender_id_type - Type de pièce d'identité
 * @param {string} shipmentData.sender_id_number - Numéro de pièce d'identité
 * @param {string} shipmentData.recipient_full_name - Nom complet du destinataire (requis)
 * @param {string} shipmentData.recipient_phone - Téléphone du destinataire (requis)
 * @param {string} shipmentData.recipient_address - Adresse du destinataire (requis)
 * @param {string} shipmentData.content_description - Description du contenu (requis)
 * @param {number} shipmentData.weight_kg - Poids en kg (requis)
 * @param {number} shipmentData.stamp_box_fdfs - Cachet boîte fdfs
 * @param {number} shipmentData.transporter_id - ID du transporteur
 * @param {File} shipmentData.package_photo - Photo du colis (requis, binary)
 * @param {File} shipmentData.sender_id_front - Photo recto pièce d'identité (binary)
 * @param {File} shipmentData.sender_id_back - Photo verso pièce d'identité (binary)
 * @returns {Promise<Object>} Le colis créé avec tracking_number et status
 */
export const createAgentShipment = async (shipmentData) => {
    try {
        let formData;

        if (shipmentData instanceof FormData) {
            formData = shipmentData;
        } else {
            // Créer un FormData pour envoyer des fichiers (multipart/form-data)
            formData = new FormData();

            // Ajouter tous les champs texte
            Object.keys(shipmentData).forEach(key => {
                if (shipmentData[key] !== undefined && shipmentData[key] !== null && shipmentData[key] !== '') {
                    // Si c'est un File, l'ajouter tel quel
                    if (shipmentData[key] instanceof File) {
                        formData.append(key, shipmentData[key]);
                    } else {
                        formData.append(key, shipmentData[key]);
                    }
                }
            });
        }

        const url = buildUrl('/api/v1/agent/shipments');

        // Pour FormData, ne pas définir Content-Type manuellement (le navigateur le fait)
        const headers = {};
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await authorizedFetch(url, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la création du colis:', error);
        throw error;
    }
};

/**
 * Recherche un colis par son numéro de suivi
 * @param {string} trackingNumber - Numéro de suivi (ex: YK-2025-00001)
 * @returns {Promise<Object>} Les détails du colis trouvé
 */
export const lookupAgentShipment = async (trackingNumber) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/lookup?q=${encodeURIComponent(trackingNumber)}`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis introuvable');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la recherche du colis:', error);
        throw error;
    }
};

/**
 * Met à jour le statut d'un colis
 * @param {number|string} shipmentId - L'ID du colis
 * @param {Object} statusData - Les données de mise à jour
 * @param {string} statusData.new_status - Nouveau statut (ex: "CHILD_EN_CHARGE", "EN_CHARGE", "EN_COURS_DE_LIVRAISON")
 * @param {string} statusData.event_time - Date/heure de l'événement (ISO 8601, ex: "2026-01-05T17:28:46.793Z")
 * @returns {Promise<Object>} Confirmation de mise à jour
 */
export const updateAgentShipmentStatus = async (shipmentId, statusData) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${shipmentId}/status`);

        const response = await authorizedFetch(url, {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(statusData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            if (response.status === 422) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erreur de validation');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
};

/**
 * Marque un colis comme reçu au point de destination
 * @param {number|string} shipmentId - L'ID du colis
 * @param {Object} receiveData - Les données de réception
 * @param {number} receiveData.destination_point_id - ID du point de destination
 * @param {string} receiveData.received_at - Date/heure de réception (ISO 8601, ex: "2026-01-05T17:29:38.694Z")
 * @returns {Promise<Object>} Confirmation de réception
 */
export const receiveAgentShipment = async (shipmentId, receiveData) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${shipmentId}/receive`);

        const response = await authorizedFetch(url, {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(receiveData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la réception du colis:', error);
        throw error;
    }
};

/**
 * Récupère l'historique complet des événements de suivi d'un colis
 * @param {number|string} shipmentId - L'ID du colis
 * @returns {Promise<Array>} Liste des événements de suivi
 */
export const fetchAgentShipmentEvents = async (shipmentId) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${shipmentId}/events`);

        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        throw error;
    }
};

/**
 * Renvoie le code de retrait par SMS au destinataire via Africamobile
 * @param {number|string} shipmentId - L'ID du colis
 * @returns {Promise<Object>} Confirmation d'envoi
 */
export const resendPickupCode = async (shipmentId) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${shipmentId}/pickup-code/resend`);

        const response = await authorizedFetch(url, {
            method: 'POST',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors du renvoi du code:', error);
        throw error;
    }
};

/**
 * Génère et télécharge la feuille de route (waybill) en format PDF
 * @deprecated Utiliser downloadWaybillPDFByTrackingNumber à la place
 * @param {string} trackingNumber - Le numéro de suivi du colis
 * @returns {Promise<Blob>} Fichier PDF
 */
export const downloadWaybillPDF = async (trackingNumber) => {
    // Rediriger vers la fonction qui utilise le tracking number
    return downloadWaybillPDFByTrackingNumber(trackingNumber);
};

export const receiveAgentShipmentByTrackingNumber = async (trackingNumber) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${trackingNumber}/receive`);

        const response = await authorizedFetch(url, {
            method: 'POST',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la réception du colis:', error);
        throw error;
    }
};
/**
 * Ouvre la feuille de route dans un nouvel onglet
 * Note: L'API retourne du HTML imprimable au lieu de PDF en raison des limitations serveur
 * @param {string} trackingNumber - Le numéro de suivi du colis
 * @returns {Promise<Blob>} Blob vide pour compatibilité
 */
export const downloadWaybillPDFByTrackingNumber = async (trackingNumber) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${trackingNumber}/waybill.pdf`);
        const token = localStorage.getItem('authToken');
        
        // Récupérer le HTML avec authentification
        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            if (response.status === 401) {
                throw new Error('Non authentifié - veuillez vous reconnecter');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Lire la réponse comme texte (HTML)
        const htmlContent = await response.text();
        
        // Ouvrir une nouvelle fenêtre et écrire le contenu HTML
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else {
            throw new Error('Le navigateur a bloqué l\'ouverture de la fenêtre. Veuillez autoriser les pop-ups.');
        }
        
        // Retourner un blob vide pour compatibilité
        return new Blob([''], { type: 'text/html' });
    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la feuille de route:', error);
        throw error;
    }
};

/**
 * Imprime la feuille de route
 * Ouvre la page dans une nouvelle fenêtre et déclenche l'impression
 * @param {string} trackingNumber - Le numéro de suivi du colis
 */
export const printWaybill = async (trackingNumber) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${trackingNumber}/waybill.pdf`);
        const token = localStorage.getItem('authToken');
        
        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            if (response.status === 401) {
                throw new Error('Non authentifié - veuillez vous reconnecter');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const htmlContent = await response.text();
        
        // Ouvrir une nouvelle fenêtre et écrire le contenu HTML
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            
            // Attendre que le contenu soit chargé puis déclencher l'impression
            newWindow.onload = () => {
                setTimeout(() => {
                    newWindow.print();
                }, 500);
            };
        } else {
            throw new Error('Le navigateur a bloqué l\'ouverture de la fenêtre. Veuillez autoriser les pop-ups.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'impression de la feuille de route:', error);
        throw error;
    }
};

/**
 * Télécharge la feuille de route
 * Télécharge le fichier HTML comme fichier .html
 * @param {string} trackingNumber - Le numéro de suivi du colis
 */
export const downloadWaybill = async (trackingNumber) => {
    try {
        const url = buildUrl(`/api/v1/agent/shipments/${trackingNumber}/waybill.pdf`);
        const token = localStorage.getItem('authToken');
        
        const response = await authorizedFetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Colis non trouvé');
            }
            if (response.status === 401) {
                throw new Error('Non authentifié - veuillez vous reconnecter');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const htmlContent = await response.text();
        
        // Créer un blob et télécharger
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `feuille-route-${trackingNumber}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Nettoyer l'URL
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
        console.error('Erreur lors du téléchargement de la feuille de route:', error);
        throw error;
    }
};
