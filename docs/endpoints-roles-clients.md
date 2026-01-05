# 📚 Endpoints - Rôles et Clients

## 🎯 Vue d'ensemble

Documentation complète des endpoints pour gérer les **rôles** et les **clients** dans l'application admin YES Karangue.

---

## 1. 📋 Liste des rôles disponibles

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/admin/roles`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Récupère la liste de tous les rôles disponibles dans le système.

### Paramètres
Aucun paramètre requis.

### Réponse (200)

```json
[
  {
    "value": "ADMIN",
    "label": "Administrateur"
  },
  {
    "value": "AGENT",
    "label": "Agent"
  },
  {
    "value": "MANAGER",
    "label": "Manager"
  }
]
```

### Structure d'un Rôle

| Champ | Type | Description |
|-------|------|-------------|
| `value` | string | Valeur technique du rôle |
| `label` | string | Label d'affichage du rôle |

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Liste des rôles retournée avec succès |
| 401 | Non authentifié |

### Implémentation Service

**Fichier:** `/src/services/rolesService.js`

```javascript
import { fetchRoles } from '../services/rolesService';

// Récupérer tous les rôles
const roles = await fetchRoles();
console.log(roles);
// Output: [{ value: "ADMIN", label: "Administrateur" }, ...]
```

### Utilisation dans un Composant

```javascript
import { useState, useEffect } from 'react';
import { fetchRoles } from '../../services/rolesService';

export default function RoleSelector() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  return (
    <select className="border rounded px-3 py-2">
      <option value="">Sélectionnez un rôle</option>
      {roles.map(role => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
}
```

### Test avec cURL

```bash
curl -X GET \
  'https://your-api.com/api/v1/admin/roles' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 2. 📋 Liste des clients (Admin)

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/admin/clients`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Récupère la liste de tous les clients (vue admin). Permet de voir tous les clients avec pagination et filtres.

### Paramètres de Requête (Query Parameters)

Tous les paramètres sont optionnels :

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------  |
| `q` | string | Recherche par nom, email ou téléphone | `?q=ahmed` |
| `limit` | integer | Nombre d'éléments par page | `?limit=20` |
| `offset` | integer | Offset pour pagination | `?offset=0` |

### Exemples d'Utilisation

#### Exemple 1: Liste complète (par défaut)
```bash
GET /api/v1/admin/clients
```

#### Exemple 2: Recherche par nom
```bash
GET /api/v1/admin/clients?q=ahmed
```

#### Exemple 3: Pagination
```bash
GET /api/v1/admin/clients?limit=10&offset=20
```

### Réponse (200)

```json
[
  {
    "id": 1,
    "full_name": "Ahmed Diallo",
    "email": "ahmed@example.com",
    "phone": "+221771234567",
    "status": "active",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-05T12:00:00Z"
  },
  {
    "id": 2,
    "full_name": "Fatou Sall",
    "email": "fatou@example.com",
    "phone": "+221782345678",
    "status": "active",
    "created_at": "2025-01-02T00:00:00Z",
    "updated_at": "2025-01-04T10:00:00Z"
  }
]
```

### Structure d'un Client

| Champ | Type | Description |
|-------|------|-------------|
| `id` | integer | ID unique du client |
| `full_name` | string | Nom complet |
| `email` | string | Email |
| `phone` | string | Numéro de téléphone |
| `status` | string | Statut du compte (`active`, `inactive`) |
| `created_at` | string | Date de création |
| `updated_at` | string | Date de dernière modification |

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Liste des clients retournée avec succès |
| 401 | Non authentifié |

### Implémentation Service

**Fichier:** `/src/services/clientsService.js`

```javascript
import { fetchClients } from '../services/clientsService';

// Liste complète
const clients = await fetchClients();

// Avec recherche
const searchResults = await fetchClients({ q: 'ahmed' });

// Avec pagination
const page2 = await fetchClients({ limit: 20, offset: 20 });
```

### Utilisation dans un Composant

```javascript
import { useState, useEffect } from 'react';
import { fetchClients } from '../../services/clientsService';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const loadClients = async () => {
    try {
      setLoading(true);
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      if (searchTerm) params.q = searchTerm;

      const data = await fetchClients(params);
      setClients(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [searchTerm, currentPage]);

  return (
    // JSX...
  );
}
```

### Test avec cURL

```bash
curl -X GET \
  'https://your-api.com/api/v1/admin/clients?q=ahmed&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 3. 👤 Détails d'un client (Admin)

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/admin/clients/{id}`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Récupère les détails complets d'un client spécifique par son ID.

### Paramètres de Route

| Paramètre | Type | Description | Requis |
|-----------|------|-------------|---------|
| `id` | integer (path) | ID du client | ✅ Oui |

### Exemple d'Utilisation

```bash
GET /api/v1/admin/clients/5
```

### Réponse (200)

```json
{
  "id": 5,
  "full_name": "Ahmed Diallo",
  "email": "ahmed@example.com",
  "phone": "+221771234567",
  "status": "active",
  "location": "Dakar, Sénégal",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-05T12:00:00Z",
  "last_login": "2025-01-05T10:00:00Z"
}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Détails du client retournés avec succès |
| 401 | Non authentifié |
| 404 | Client non trouvé |

### Réponse d'Erreur (404)

```json
{
  "error": {
    "code": "INVALID_CODE",
    "message": "Client non trouvé",
    "details": []
  }
}
```

### Implémentation Service

**Fichier:** `/src/services/clientsService.js`

```javascript
import { fetchClientById } from '../services/clientsService';

// Récupérer un client par ID
try {
  const client = await fetchClientById(5);
  console.log(client);
} catch (error) {
  if (error.message.includes('non trouvé')) {
    // Gérer le 404
    alert('Ce client n\'existe pas');
  } else {
    console.error('Erreur:', error);
  }
}
```

### Utilisation dans un Composant

```javascript
import { useState } from 'react';
import { fetchClientById } from '../../services/clientsService';

export default function ClientDetailsModal({ clientId, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        const data = await fetchClientById(clientId);
        setClient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadClient();
    }
  }, [clientId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="modal">
      <h2>{client.full_name}</h2>
      <p>Email: {client.email}</p>
      <p>Téléphone: {client.phone}</p>
      {/* ... */}
    </div>
  );
}
```

### Test avec cURL

```bash
curl -X GET \
  'https://your-api.com/api/v1/admin/clients/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 📊 Résumé des Endpoints

| Endpoint | Méthode | Description | Service |
|----------|---------|-------------|---------|
| `/api/v1/admin/roles` | GET | Liste des rôles disponibles | `fetchRoles` |
| `/api/v1/admin/clients` | GET | Liste des clients | `fetchClients` |
| `/api/v1/admin/clients/{id}` | GET | Détails d'un client | `fetchClientById` |

---

## 📁 Fichiers Créés

### Services
- ✅ `/src/services/rolesService.js` - Service pour les rôles
- ✅ `/src/services/clientsService.js` - Service pour les clients

### Pages
- ✅ `/src/pages/clients/ClientsPage.jsx` - Page liste des clients (mise à jour)

### Documentation
- ✅ `/docs/endpoints-roles-clients.md` - Ce fichier

---

## 🚀 Workflows Utilisateur

### Workflow 1: Sélectionner un rôle dans un formulaire

```
1. Composant (formulaire) se monte
   ↓
2. Appel API GET /api/v1/admin/roles
   ↓
3. Affichage de la liste dans un <select>
   ↓
4. Utilisateur sélectionne un rôle
   ↓
5. Valeur (ex: "ADMIN") est sauvegardée
```

### Workflow 2: Voir la liste des clients

```
1. Admin accède à /clients
   ↓
2. Appel API GET /api/v1/admin/clients
   ↓
3. Affichage de la liste dans un tableau
   ↓
4. Admin peut rechercher/filtrer
   ↓
5. Nouvels appels API avec paramètres
```

### Workflow 3: Voir les détails d'un client

```
1. Admin clique sur l'icône "Œil" 👁️
   ↓
2. Appel API GET /api/v1/admin/clients/{id}
   ↓
3. Affichage des détails dans une modal
   ↓
4. Admin peut voir toutes les informations
```

---

## 💡 Bonnes Pratiques

### 1. Cacher les rôles pour réutilisation

```javascript
// Dans un contexte global ou hook personnalisé
const useRoles = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      const data = await fetchRoles();
      setRoles(data);
      // Sauvegarder dans localStorage pour cache
      localStorage.setItem('roles', JSON.stringify(data));
    };

    // Charger depuis cache d'abord
    const cached = localStorage.getItem('roles');
    if (cached) {
      setRoles(JSON.parse(cached));
    }

    loadRoles();
  }, []);

  return roles;
};
```

### 2. Debounce pour la recherche de clients

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  loadClients();
}, [debouncedSearch]); // Utiliser debouncedSearch
```

### 3. Gestion des erreurs 404

```javascript
try {
  const client = await fetchClientById(id);
  setClient(client);
} catch (error) {
  if (error.message.includes('non trouvé')) {
    setToast({
      message: 'Client introuvable',
      type: 'error'
    });
    onClose(); // Fermer la modal
  }
}
```

---

## 🧪 Tests

### Test Manuel

1. **Tester la liste des rôles:**
   - Ouvrir un formulaire avec sélection de rôle
   - Vérifier que les rôles s'affichent

2. **Tester la liste des clients:**
   - Aller sur /clients
   - Vérifier l'affichage de la liste
   - Tester la recherche
   - Tester la pagination

3. **Tester les détails d'un client:**
   - Cliquer sur l'icône "Œil"
   - Vérifier l'affichage de la modal
   - Vérifier toutes les informations

### Test avec cURL

Voir les exemples dans chaque section endpoint.

---

## ✅ Checklist d'Intégration

- ✅ Service `rolesService.js` créé
- ✅ Service `clientsService.js` créé
- ✅ Page `ClientsPage.jsx` mise à jour
- ✅ Appels API intégrés
- ✅ Pagination fonctionnelle
- ✅ Recherche fonctionnelle
- ✅ Modal de détails fonctionnelle
- ✅ Gestion des erreurs (404, 401)
- ✅ Loaders pendant les chargements
- ✅ Toast de notifications
- ✅ Documentation complète

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
